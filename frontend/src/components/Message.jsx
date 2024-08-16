import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
// import { selectedConversationAtom } from "../atoms/messagesAtom";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { BsCheck2All } from "react-icons/bs";
// import { useState } from "react";

const Message = ({ ownMessage}) => {
	// const selectedConversation = useRecoilValue(selectedConversationAtom);
	// const user = useRecoilValue(userAtom);
	// const [imgLoaded, setImgLoaded] = useState(false);
	return (
		<>
			{ownMessage ? (
				<Flex gap={2} alignSelf={"flex-end"}>
					<Text maxW={"350px"} bg={"blue.300"} p={1} borderRadius={"md"} color={"black"}>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus libero vel doloremque, sapiente vitae assumenda dolorum, ipsa, cumque autem inventore dolorem provident dolor ex ratione. Incidunt consequuntur atque quibusdam assumenda.
					</Text>
					<Avatar src='' w='7' h={7} />
				</Flex>
			) : (
				<Flex gap={2}>
					<Avatar src='' w='7' h={7} />

						<Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque corrupti provident inventore eius. Totam animi enim aspernatur dolore, perferendis error nam incidunt saepe dolor. Culpa doloremque cum sequi alias hic?
						</Text>
					
				
				</Flex>
			)}
		</>
	);
};

export default Message;
