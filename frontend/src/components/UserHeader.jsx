import {Box, Flex,VStack,Text,Avatar,Link} from '@chakra-ui/react'
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
const UserHeader = () => {
  const toast = useToast()

  const copyURL = () => {
     const currentURL = window.location.href;
     navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
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
          Mark Zuckerberg
        </Text>
        <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"} >
              mark Zuckerberg
            </Text>
            <Text fontSize={{
              base:"xs",
              md: "sm",
              'lg':"md",
            }} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
              puzzle chat.next
            </Text>

        </Flex>
      </Box>
      <Box>
        <Avatar name="mark zuckerberg"src="/zuck-avatar.png"size={
          {
            base:"md",
            md: "xl",
          }
        } />
      </Box>
    </Flex>

    <Text>I am a product designer and I love building products that people love.</Text>
    <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>3.2k followers</Text>
            <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>babouche.com</Link>
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
                <MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
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
