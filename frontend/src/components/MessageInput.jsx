import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { GrSend } from "react-icons/gr";
// import { useRef, useState } from "react";
// import { IoSendSharp } from "react-icons/io5";
// import useShowToast from "../hooks/useShowToast";
// import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import { BsFillImageFill } from "react-icons/bs";
// import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = () => {

	return (
		
			<form >
				<InputGroup>
					<Input
						w={"full"}
						placeholder='输入消息...'
						// onChange={(e) => setMessageText(e.target.value)}
						// value={messageText}
					/>
					<InputRightElement >
					  <GrSend size={25}/>
					</InputRightElement>
				</InputGroup>
			</form>
	);
};
	
			
		
 

export default MessageInput;
