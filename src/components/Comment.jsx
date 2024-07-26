import { useState } from'react'
import { Flex, Text, Avatar, Divider } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';
const Comment = () => {
    const [liked,setLiked] = useState(false);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
      <Avatar src={'/zuck-avatar.png'} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize='sm' fontWeight='bold'>
							babouche
						</Text>
                        <Flex gap={2} alignContent={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>id</Text>
                            <BsThreeDots />
                        </Flex>
					</Flex>
					<Text>this is awesome</Text>
                    <Actions liked={liked} setLiked={setLiked} />   
                    <Text color={"gray.light"} fontSize={"sm"}>
                        {100+(liked ? 1 : 0)} likes
                    </Text>
				</Flex>

      </Flex>
      <Divider my={4} />
    </>
  )
}

export default Comment
