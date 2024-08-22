import {
	Avatar,
	Box,
	Button,
	Flex,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { PiHandFistLight } from "react-icons/pi";; // 引入react-icon
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useNavigate } from "react-router-dom";

const Actions = ({ post}) => {
	const user = useRecoilValue(userAtom);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	const [hugged, setHugged] = useState(post.hugs.includes(user?._id)); // 拥抱状态
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [isLiking, setIsLiking] = useState(false);
	const [isHugging, setIsHugging] = useState(false); // 拥抱状态的加载控制
	const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");
	const [modalUsers, setModalUsers] = useState([]);
	const [modalTitle, setModalTitle] = useState("");
	const navigate = useNavigate();

	// 用于评论的弹窗
	const { isOpen: isReplyModalOpen, onOpen: onReplyModalOpen, onClose: onReplyModalClose } = useDisclosure();
	
	// 用于点赞/碰拳用户列表的弹窗
	const { isOpen: isUsersModalOpen, onOpen: onUsersModalOpen, onClose: onUsersModalClose } = useDisclosure();

	const fetchUsers = async (type) => {
		try {
			const res = await fetch(`/api/posts/${type}/${post._id}`);
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");
			setModalUsers(data);
			setModalTitle(type === "likes" ? "点赞用户" : "碰拳用户");
			onUsersModalOpen(); // 打开用户列表弹窗
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	const showToast = useShowToast();

	const handleLikeAndUnlike = async () => {
		if (!user) return showToast("Error", "您必须登录才能点赞", "error");
		if (isLiking) return;
		setIsLiking(true);
		try {
			const res = await fetch("/api/posts/like/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return {
						...p,
						likes: liked
							? p.likes.filter((id) => id !== user._id)
							: [...p.likes, user._id],
					};
				}
				return p;
			});
			setPosts(updatedPosts);
			setLiked(!liked);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLiking(false);
		}
	};

	const handleHugAndUnhug = async () => {
		if (!user) return showToast("Error", "您必须登录才能拥抱", "error");
		if (isHugging) return;
		setIsHugging(true);
		try {
			const res = await fetch("/api/posts/hug/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return {
						...p,
						hugs: hugged
							? p.hugs.filter((id) => id !== user._id)
							: [...p.hugs, user._id],
					};
				}
				return p;
			});
			setPosts(updatedPosts);
			setHugged(!hugged);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsHugging(false);
		}
	};

	const handleReply = async () => {
		if (!user) return showToast("Error", "您必须登录才能回复", "error");
		if (isReplying) return;
		setIsReplying(true);
		try {
			const res = await fetch("/api/posts/reply/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: reply }),
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [...p.replies, data] };
				}
				return p;
			});
			setPosts(updatedPosts);
			showToast("Success", "回复已发送", "success");
			onReplyModalClose(); // 关闭回复的 Modal
			setReply("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsReplying(false);
		}
	};
	// 调试输出，检查 user 对象是否完整
	// console.log(user);

	return (
		<Flex flexDirection="column">
			<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
				<svg
					aria-label="Like"
					color={liked ? "rgb(237, 73, 86)" : ""}
					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
					height="19"
					role="img"
					viewBox="0 0 24 22"
					width="20"
					onClick={handleLikeAndUnlike}
				>
					<path
						d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
						stroke="currentColor"
						strokeWidth="2"
					></path>
				</svg>

				<svg
					aria-label="Comment"
					color=""
					fill=""
					height="20"
					role="img"
					viewBox="0 0 24 24"
					width="20"
					onClick={onReplyModalOpen} // 打开评论弹窗
				>
					<title>Comment</title>
					<path
						d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
						fill="none"
						stroke="currentColor"
						strokeLinejoin="round"
						strokeWidth="2"
					></path>
				</svg>

				<PiHandFistLight
				color={hugged ? "orange" : useColorModeValue("black", "white")}
				size="23"
				onClick={handleHugAndUnhug}
				style={{ cursor: "pointer" }}
				/>

			</Flex>

			<Flex gap={2} alignItems={"center"}>
				<Text color={"gray.light"} fontSize="sm">
					{post.replies.length} 回复
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text onClick={() => fetchUsers("likes")} color={"gray.light"} fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline"}}>
					{post.likes.length} 点赞
				</Text>
				<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
				<Text onClick={() => fetchUsers("hugs")} color={"gray.light"} fontSize="sm" cursor="pointer" _hover={{ textDecoration: "underline"}}>
					{post.hugs.length} 碰拳
				</Text>
			</Flex>
			{/* 用户列表弹窗 */}
			<Modal isOpen={isUsersModalOpen} onClose={onUsersModalClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{modalTitle}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{modalUsers.map((user) => (
							<Flex key={user._id} alignItems="center" gap={3} mb={2}>
								<Avatar src={user.profilePic} name={user.username} size="sm" cursor={"pointer"} onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${user.username}`);
                        }}/>
								<Text>{user.username}</Text>
								<Text color={"gray.light"} fontSize="sm">
									{user.name}
								</Text>
							</Flex>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal isOpen={isReplyModalOpen} onClose={onReplyModalClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Input
								placeholder="在此输入回复内容"
								value={reply}
								onChange={(e) => setReply(e.target.value)}
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							size={"sm"}
							mr={3}
							isLoading={isReplying}
							onClick={handleReply}
						>
							回复
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default Actions;






// import {
// 	Box,
// 	Button,
// 	Flex,
// 	FormControl,
// 	Input,
// 	Modal,
// 	ModalBody,
// 	ModalCloseButton,
// 	ModalContent,
// 	ModalFooter,
// 	ModalHeader,
// 	ModalOverlay,
// 	Text,
// 	useDisclosure,
// } from "@chakra-ui/react";
// import { useState } from 'react'
// import { useRecoilValue, useRecoilState } from 'recoil'
// import userAtom from '../atoms/userAtom'
// import useShowToast from '../hooks/useShowToast'
// import postsAtom from "../atoms/postsAtom";



// const Actions = ({ post }) => {
//   const user = useRecoilValue(userAtom)
  
//   const [liked, setLiked] = useState(post.likes.includes(user?._id));
//   const [posts, setPosts] = useRecoilState(postsAtom);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isReplying, setIsReplying] = useState(false);
//   const [reply, setReply] = useState("");

//   const showToast = useShowToast()
//   const { isOpen, onOpen, onClose } = useDisclosure()


//   const handleLikeAndUnlike = async () => {
// 	if (!user) return showToast("Error", "您必须登录才能点赞", "error");
// 	if (isLiking) return;
// 	setIsLiking(true);
// 	try {
// 		const res = await fetch("/api/posts/like/" + post._id, {
// 			method: "PUT",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});
// 		const data = await res.json();
// 		if (data.error) return showToast("Error", data.error, "error");
// 		console.log(data)

// 		if (!liked) {
// 			// add the id of the current user to post.likes array
// 			const updatedPosts = posts.map((p) => {
// 				if (p._id === post._id) {
// 					return { ...p, likes: [...p.likes, user._id] };
// 				}
// 				return p;
// 			});
// 			setPosts(updatedPosts);
// 		} else {
// 			// remove the id of the current user from post.likes array
// 			const updatedPosts = posts.map((p) => {
// 				if (p._id === post._id) {
// 					return { ...p, likes: p.likes.filter((id) => id !== user._id) };
// 				}
// 				return p;
// 			});
// 			setPosts(updatedPosts);
// 		}

// 		setLiked(!liked);
// 	} catch (error) {
// 		showToast("Error", error.message, "error");
// 	} finally {
// 		setIsLiking(false);
// 	}
// };

// 	//处理回复
// 	const handleReply = async () => {
// 		if (!user) return showToast("Error", "你必须登录才能进行回复", "error");
// 		if (isReplying) return;
// 		setIsReplying(true);
// 		try {
// 			const res = await fetch("/api/posts/reply/" + post._id, {
// 				method: "PUT",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ text: reply }),
// 			});
// 			const data = await res.json();
// 			if (data.error) return showToast("Error", data.error, "error");

// 			const updatedPosts = posts.map((p) => {
// 				if (p._id === post._id) {
// 					return { ...p, replies: [...p.replies, data] };
// 				}
// 				return p;
// 			});
// 			setPosts(updatedPosts);
// 			showToast("Success", "回复已发送", "success");
// 			onClose();
// 			setReply("");
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		} finally {
// 		   setIsReplying(false);
// 		}
// 	};


//   return (
// 	<Flex flexDirection = "column">
//   <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
// 	{/* 四种操作图标： */}
//                <svg
// 					aria-label='Like'
// 					color={liked ? "rgb(237, 73, 86)" : ""}
// 					fill={liked ? "rgb(237, 73, 86)" : "transparent"}
// 					height='19'
// 					role='img'
// 					viewBox='0 0 24 22'
// 					width='20'
// 					onClick={handleLikeAndUnlike}
// 				>
// 					<path
// 						d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
// 						stroke='currentColor'
// 						strokeWidth='2'
// 					></path>
// 				</svg>

// 				<svg
// 					aria-label='Comment'
// 					color=''
// 					fill=''
// 					height='20'
// 					role='img'
// 					viewBox='0 0 24 24'
// 					width='20'
// 	                onClick={onOpen}
// 				>
// 					<title>Comment</title>
// 					<path
// 						d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
// 						fill='none'
// 						stroke='currentColor'
// 						strokeLinejoin='round'
// 						strokeWidth='2'
// 					></path>
// 				</svg>
		
// 		   <RepostSVG />



// 		</Flex>

// 		<Flex gap={2} alignItems={"center"}>
//            <Text color={"gray.light"} fontSize='sm'>
//                {post.replies.length} 回复
//            </Text>
//            <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
//            <Text color={"gray.light"} fontSize='sm'>
//                {post.likes.length} 点赞
//            </Text>
//        </Flex>

// 	   <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//        >
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader></ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={6}>
//             <FormControl>
//               <Input  placeholder='在此输入回复内容'
// 			   value={reply}
// 			   onChange={(e) => setReply(e.target.value)}			  
// 			  />
//             </FormControl>

//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme='blue' size={"sm"}mr={3}
// 			 isLoading={isReplying}
// 			 onClick={handleReply}
// 			>
//               回复
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//   </Flex>
//   )
// }

// export default Actions

// const RepostSVG = () => {
// 	return(
// 		<svg
//                 aria-label='Repost'
//                 color='currentColor'
//                 fill='currentColor'
//                 height='20'
//                 role='img'
//                 viewBox='0 0 24 24'
//                 width='20'
//                 >
//                 <title>Repost</title>
//                 <path
//                     fill=''
//                     d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
//                 ></path>
//             </svg>
// 	)
// }
