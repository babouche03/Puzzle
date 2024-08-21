import {Box, Flex,VStack,Text,Avatar,Link,Button,useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, 
  ModalBody, ModalFooter, useDisclosure, Spinner} from '@chakra-ui/react'
import { MdOutlineTextsms } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink, useParams} from "react-router-dom";
import useFollowUnfollow from '../hooks/useFollowUnfollow';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const UserHeader = ({user}) => {
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const bgColor = useColorModeValue("gray.100", "gray.700");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState([]);
  const navigate = useNavigate();

  const openModal = (type) => {
    setModalType(type);
    setLoading(true);

    // 根据类型（followers 或 following）获取数据
    fetch(`/api/users/${user._id}/${type}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // 打印从后端获取的数据
        setModalData(data);
        setLoading(false);
        onOpen();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const copyURL = () => {
     const currentURL = window.location.href;
     navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "个人主页链接已复制到剪贴板",
				duration: 3000,
				isClosable: true,
			});
    });
  }
  
  return (
   <VStack gap={4} alignItems={"start"}>
    <Flex justifyContent={'space-between'} w={"full"}> 
      <Box>
        <Text fontSize={"2xl"} fontWeight={"bold"}>
          {user.username}
        </Text>
        <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"md"} >
              {user.name}
            </Text>
            <Text fontSize={{
              base:"xs",
              md: "sm",
              'lg':"md",
            }} bg={bgColor} color={"gray.light"} p={1} borderRadius={"full"}>
              puzzle.site
            </Text>

        </Flex>
      </Box>
      <Box>
      {user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
      </Box>
    </Flex>

    <Text>{user.bio}</Text>

    {/* 若当前页面的查看用户为登录用户,则有权限更新个人资料 */}
    {currentUser?._id === user._id && (
      <Link as={RouterLink} to='/update'>
        <Button size={"sm"}>更新个人信息</Button>
      </Link>
    )}
   
   	{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "取消关注" : "关注"}
				</Button>
			)}
  
    <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} cursor="pointer" onClick={() => openModal("followers")}>{user.followers.length} 关注者</Text>
            <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"} cursor="pointer" onClick={() => openModal("following")}>{user.following.length} 正在关注</Text>
        </Flex>
        <Flex>
            <Box className='icon-container'>
            <BsChatText size={25} cursor={"pointer"}/>
            </Box>
            <Box className='icon-container'>
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                <MenuList bg={bgColor}>
									<MenuItem bg={bgColor} onClick={copyURL}>
										复制链接 
									</MenuItem>
								</MenuList>
                </Portal>
              </Menu>
                
            </Box>
        </Flex>
    </Flex>

    {/* Modal 弹窗 */}
    <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>{modalType === "followers" ? "关注者" : "正在关注"}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      {loading ? (
        <Spinner />
      ) : (
        modalData.map((user) => (
          <Flex key={user._id} alignItems="center" mb={3}>
            <Avatar name={user.name} src={user.profilePic} mr={3} onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/${user.username}`;
                            onClose();
                        }} />
            <Text>{user.username}</Text>
          </Flex>
        ))
      )}
    </ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>关闭</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
      
    <Flex w={"full"}>
    <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Puzzle</Text>
		</Flex>
    {/* <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} color={"gray.light"} pb='3' cursor={"pointer"}>
          <Text fontWeight={"bold"}> Replies</Text>
    </Flex> */}
    </Flex>
   
   </VStack>
  )
}

export default UserHeader
