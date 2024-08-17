import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";

const Message = ({ ownMessage, message}) => {
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const user = useRecoilValue(userAtom);
	// const [imgLoaded, setImgLoaded] = useState(false);
	const bgColor = useColorModeValue("gray.400", "gray.600");
	const blueColor = useColorModeValue("blue.200", "blue.400");
	
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
					<Text maxW={"350px"} bg={blueColor} p={1} borderRadius={"md"} color={"black"}>
						{message.text}
					</Text>
					<Avatar src={user.profilePic} w='7' h={7} />
				</Flex>
			) : (
				<Flex gap={2}>
					<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />

						<Text maxW={"350px"} bg={bgColor} p={1} borderRadius={"md"} color={"white"}>
							{message.text}
						</Text>
					
				
				</Flex>
			)}
		</>
	);
};

export default Message;
