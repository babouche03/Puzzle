import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { VscAccount } from "react-icons/vsc";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
   <Flex justifyContent={"space-between"} mt={6} mb='12'>

    {user &&(
      <Link as ={RouterLink} to="/">
        <AiFillHome size={24} /> 
      </Link>
    )}

    <Image 
      cursor={'pointer'}
      alt='logo'
      w={6}
      src={colorMode ==='dark' ? "/light-logo.svg" : "/dark-logo.svg"}
      onClick={toggleColorMode}
    /> 

     {user && (
        <Flex alignItems={"center"} gap={4}>


          <Link as={RouterLink} to={`/${user.username}`}>
					<VscAccount size={24} />  
				</Link>
        <Button  size={"xs"} >
			    <FiLogOut size={20} />
		    </Button>
        </Flex>
				
			)}
   </Flex>
  );
};

export default Header
