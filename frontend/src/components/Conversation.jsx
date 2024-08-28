import {
	Avatar,
	AvatarBadge,
	Box,
	Flex,
	Image,
	Stack,
	Text,
	WrapItem,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ conversation, isOnline }) => {
	const user = conversation.participants[0];
	const currentUser = useRecoilValue(userAtom);
	const lastMessage = conversation.lastMessage;
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const bgColor = useColorModeValue("gray.200", "gray.700");
	// 检查最新消息是否是其他用户发来的且未读
	const isUnread = lastMessage && lastMessage.sender.toString() !== currentUser._id.toString() && !lastMessage.seen;


	return (
		<Flex
			gap={4}
			alignItems={"center"}
			p={"1"}
			_hover={{
				cursor: "pointer",
				bg: useColorModeValue("gray.300", "gray.600"),
				color: "white",
			}}
			onClick={() =>
				setSelectedConversation({
					_id: conversation._id,
					userId: user._id,
					userProfilePic: user.profilePic,
					username: user.username,
					mock: conversation.mock,
				})
			}
			bg={
				selectedConversation?._id === conversation._id ? bgColor : ""
			}
			borderRadius={"md"}
		>
			<WrapItem>
				<Avatar
					size={{
						base: "xs",
						sm: "sm",
						md: "md",
					}}
					src={user.profilePic}
				>
					
					{isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ""}
				</Avatar>
			</WrapItem>

			<Stack direction={"column"} fontSize={"sm"}>
				<Text fontWeight='700' display={"flex"} alignItems={"center"}>
					{user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
				<Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
				{currentUser._id === lastMessage?.sender ? (
					<Box color={lastMessage?.seen ? "green.400" : ""}>
					<BsCheck2All size={16} />
					</Box>
				) : (
					""
				)}
				{lastMessage?.text?.length > 18
					? lastMessage.text.substring(0, 18) + "..."
					: lastMessage?.text || <BsFillImageFill size={16} />}
					{isUnread && (
						<Box
							bg="red.500"
							borderRadius="full"
							width="9px"
							height="9px"
							ml={3} // 添加一点左边距，使红点与文本分开
						/>
					)}
				</Text>
			</Stack>
		</Flex>
	);
};

export default Conversation;
