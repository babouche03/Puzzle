import {Avatar,Flex,Image,Text,Box,Divider,Button} from "@chakra-ui/react"
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src='/zuck-avatar.png' size={"md"} name='Mark Zuckerberg' />
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                babouche
              </Text>
              <Image src='/verified.png' w='4' h={4} ml={4} />
            </Flex>
          </Flex>
          <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"sm"} color={"gray.light"}>
              1d
            </Text>
            <BsThreeDots />
          </Flex>
          {/* <Flex gap={4} alignItems={"center"}>
            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
              {formatDistanceToNow(new Date(currentPost.createdAt))} ago
            </Text>

            {currentUser?._id === user._id && (
              <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
            )}
        </Flex> */}
      </Flex>
      <Text my={3}>Lets talk about puzzle.</Text>
      
         <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
               <Image src={"/post1.png"} w={"full"} />
         </Box>

         <Flex gap={3} my={3}>
          <Actions liked={liked} setLiked={setLiked} />
         </Flex>

          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>238 replies</Text>
            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"} fontSize={"sm"}>
            {200+(liked ? 1 : 0)} likes
            </Text>
         </Flex>
         <Divider my={4} />

         <Flex justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>✏️</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
          </Flex>
          <Button>GET</Button>
         </Flex>

         <Divider my={4} />

         <Comment 
           comment='good'
           createdAt='2d'
           likes={100}
           username='johndoe'
           userAvatar='https://bit.ly/dan-abramov'
         />

         <Comment 
           comment='nice'
           createdAt='1d'
           likes={10}
           username='babouche'
           userAvatar='https://bit.ly/dan-abramov'
         />

          <Comment 
           comment='fuck u'
           createdAt='2d'
           likes={200}
           username='kate'
           userAvatar='https://bit.ly/kent-c-dodds'
         />
      
    </>
  )
}

export default PostPage
