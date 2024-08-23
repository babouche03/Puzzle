import { Button, Flex, Image, Input, Link, useColorMode, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, VStack,InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/users/profile/${searchQuery}`);
      const data = await response.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
    }
      setSearchResults([data]); // 设置为数组以匹配下拉框的数据结构
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

    // 清空搜索记录并关闭弹窗
    const handleClose = () => {
      setSearchResults([]);
      setSearchQuery('');
      onClose();
    };

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
          <BsSearch size={22} onClick={onOpen} />
          <Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={24} />
					</Link>
        </Flex>
      )}

      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")} fontSize={"18"}>
          登录
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={7}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <VscAccount size={24} />
          </Link>
          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={24} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}

      {!user && (
        <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")} fontSize={"18"}>
          注册
        </Link>
      )}

      {/* 搜索弹出框 */}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>搜索用户</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <InputGroup mb={5}>
            <Input
              placeholder="输入用户名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputRightElement>
              <Button onClick={handleSearch} borderRadius={"0px 7px 7px 0px"}>
                🔍
              </Button>
            </InputRightElement>
          </InputGroup>
            {/* 显示搜索结果 */}
            {searchResults.length > 0 && (
              <Box mt={3} borderWidth="0px" borderRadius="md" p={2}>
                <VStack spacing={2} align="start">
                  {searchResults.map(user => (
                    <Flex key={user._id} align="center" gap={2}>
                      <Image
                        borderRadius="full"
                        boxSize="40px"
                        src={user.profilePic}
                        alt={user.username}
                      />
                      <Link as={RouterLink} to={`/${user.username}`} fontWeight="bold" >
                        <Flex onClick={onClose}>
                          {user.username}
                        </Flex>
                        
                      </Link>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Header;





// import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { AiFillHome } from "react-icons/ai";
// import { BsSearch } from "react-icons/bs";
// import { RxAvatar } from "react-icons/rx";
// import { VscAccount } from "react-icons/vsc";
// import { Link as RouterLink } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import { BsFillChatQuoteFill } from "react-icons/bs";
// import { MdOutlineSettings } from "react-icons/md";
// import useLogout from "../hooks/useLogout";
// import  authScreenAtom  from "../atoms/authAtom";

// const Header = () => {
//   const { colorMode, toggleColorMode } = useColorMode();
//   const user = useRecoilValue(userAtom);
//   const logout = useLogout();
//   const setAuthScreen = useSetRecoilState(authScreenAtom);

//   return (
//    <Flex justifyContent={"space-between"} mt={6} mb='12'>
   
//     {user &&(
//       <Flex alignItems={"center"} gap={5}> 
//         <Link as ={RouterLink} to="/">
//         <AiFillHome size={24} /> 
//         </Link>
//         <BsSearch size={22}/>
//       </Flex>

     
      
//     )}

//     {!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")} fontSize={"18"}>
// 					登录
// 				</Link>
// 			)}

//     <Image 
//       cursor={'pointer'}
//       alt='logo'
//       w={6}
//       src={colorMode ==='dark' ? "/light-logo.svg" : "/dark-logo.svg"}
//       onClick={toggleColorMode}
//     /> 

//      {user && (
//         <Flex alignItems={"center"} gap={4}>


//           <Link as={RouterLink} to={`/${user.username}`}>
// 					<VscAccount size={24} />  
// 				  </Link>
//           <Link as={RouterLink} to={`/chat`}>
// 						<BsFillChatQuoteFill size={24} />
// 					</Link>
//         <Button  size={"xs"} onClick={logout}>
// 			    <FiLogOut size={20} />
// 		    </Button>
//         </Flex>
// 			)}

//        {!user && (
// 				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")} fontSize={"18"} >
// 					注册
// 				</Link>
// 			)}
//    </Flex>
//   );
// };

// export default Header

