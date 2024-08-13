import {Box, Flex,VStack,Text,Avatar,Link,Button,useColorModeValue} from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {Link as RouterLink} from "react-router-dom";
import useFollowUnfollow from '../hooks/useFollowUnfollow';

const UserHeader = ({user}) => {
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const bgColor = useColorModeValue("gray.100", "gray.700");

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
            <Text fontSize={"sm"} >
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
            <Text color={"gray.light"}>{user.followers.length} 关注者</Text>
            <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"}>{user.following.length} 正在关注</Text>
        </Flex>
        <Flex>
            <Box className='icon-container'>
                <BsInstagram size={24} cursor={"pointer"} />
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
    <Flex w={"full"}>
    <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Puzzle</Text>
		</Flex>
    <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} color={"gray.light"} pb='3' cursor={"pointer"}>
          <Text fontWeight={"bold"}> Replies</Text>
    </Flex>
    </Flex>
   
   </VStack>
  )
}

export default UserHeader
