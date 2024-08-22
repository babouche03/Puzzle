import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue,} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { PiWechatLogoDuotone } from "react-icons/pi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useSearchParams } from "react-router-dom"; // 引入用于解析URL参数的hook

const ChatPage = () => {
    const [searchingUser, setSearchingUser] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();
	const [searchParams] = useSearchParams(); // 获取URL参数
    const username = searchParams.get("username"); // 解析username参数

	useEffect(() => {
        if (username) {
            setSearchText(username); // 将URL中的用户名设置为搜索框的内容
        }
    }, [username]);

    useEffect(() => {
        if (searchText) {
            handleConversationSearch(); // 自动触发搜索函数
        }
    }, [searchText]); // 当searchText改变时，自动触发搜索

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally{
				setLoadingConversations(false);
			}
			
		};

		getConversations();
	}, [showToast, setConversations]);


	const handleConversationSearch = async (e) => {
		e.preventDefault();
		// 防止空输入的搜索
        if (!searchText.trim()) {
            showToast("Error", "请输入有效的用户名或PuzzleID进行搜索!", "error");
            return;
        }

        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();

            if (searchedUser.error) {
                showToast("Error", searchedUser.error, "error");
                return;
            }

            const messagingYourself = searchedUser._id === currentUser._id;
            if (messagingYourself) {
                showToast("Error", "你不能与自己私聊！", "error");
                return;
            }

            const conversationAlreadyExists = conversations.find(
                (conversation) => conversation.participants[0]._id === searchedUser._id
            );

            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                });
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    },
                ],
            };
            setConversations((prevConvs) => [...prevConvs, mockConversation]);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setSearchingUser(false);
        }
    };

	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{ base: "100%", md: "80%", lg: "750px" }}
			p={4}
			transform={"translateX(-50%)"}
		>
			<Flex
				gap={4}
				flexDirection={{ base: "column", md: "row" }}
				maxW={{ sm: "400px", md: "full" }}
				mx={"auto"}
			>
				<Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
					<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
						信息列表 📄
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex alignItems={"center"} gap={2}>
							<Input
								placeholder='寻找用户'
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
								<SearchIcon />
							</Button>
						</Flex>
					</form>

					{loadingConversations &&
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								<Flex w={"full"} flexDirection={"column"} gap={3}>
									<Skeleton h={"10px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90%"} />
								</Flex>
							</Flex>
						))}

					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}
				</Flex>

				{!selectedConversation._id && (
					<Flex
						flex={70}
						borderRadius={"md"}
						p={2}
						flexDir={"column"}
						alignItems={"center"}
						justifyContent={"center"}
						height={"400px"}
					>
						<PiWechatLogoDuotone size={100} />
						<Text fontSize={20}>选择一个用户开始聊天 🌐</Text>
					</Flex>
				)}

				{selectedConversation._id && <MessageContainer />}
			</Flex>
		</Box>
	);
};

export default ChatPage;






// import { SearchIcon } from "@chakra-ui/icons";
// import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue,} from "@chakra-ui/react";
// import Conversation from "../components/Conversation";
// import { PiWechatLogoDuotone } from "react-icons/pi";
// import MessageContainer from "../components/MessageContainer";
// import { useEffect, useState } from "react";
// import useShowToast from "../hooks/useShowToast";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
// import userAtom from "../atoms/userAtom";
// import { useSocket } from "../context/SocketContext";

// const ChatPage = () => {
//     const [searchingUser, setSearchingUser] = useState(false);
//     const [loadingConversations, setLoadingConversations] = useState(true);
// 	const [searchText, setSearchText] = useState("");
// 	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
// 	const [conversations, setConversations] = useRecoilState(conversationsAtom);
// 	const currentUser = useRecoilValue(userAtom);
// 	const showToast = useShowToast();
// 	const { socket, onlineUsers } = useSocket();

// 	useEffect(() => {
// 		socket?.on("messagesSeen", ({ conversationId }) => {
// 			setConversations((prev) => {
// 				const updatedConversations = prev.map((conversation) => {
// 					if (conversation._id === conversationId) {
// 						return {
// 							...conversation,
// 							lastMessage: {
// 								...conversation.lastMessage,
// 								seen: true,
// 							},
// 						};
// 					}
// 					return conversation;
// 				});
// 				return updatedConversations;
// 			});
// 		});
// 	}, [socket, setConversations]);
	

// 	useEffect(() => {
// 		const getConversations = async () => {
// 			try {
// 				const res = await fetch("/api/messages/conversations");
// 				const data = await res.json();
// 				if (data.error) {
// 					showToast("Error", data.error, "error");
// 					return;
// 				}
// 				console.log(data);
// 				setConversations(data);
// 			} catch (error) {
// 				showToast("Error", error.message, "error");
// 			} finally{
// 				setLoadingConversations(false);
// 			}
			
// 		};

// 		getConversations();
// 	}, [showToast,setConversations]);

// 	const handleConversationSearch = async (e) => {
// 		e.preventDefault();
// 		// 防止空输入的搜索
// 	if (!searchText.trim()) {
// 		showToast("Error", "请输入有效的用户名或PuzzleID进行搜索!", "error");
// 		return;
// 	}
// 		setSearchingUser(true);
// 		try {
// 			const res = await fetch(`/api/users/profile/${searchText}`);
// 			const searchedUser = await res.json();
// 			if (searchedUser.error) {
// 				showToast("Error", searchedUser.error, "error");
// 				return;
// 			}

// 			const messagingYourself = searchedUser._id === currentUser._id;
// 			if (messagingYourself) {
// 				showToast("Error", "你不能与自己私聊！", "error");
// 				return;
// 			}

// 			const conversationAlreadyExists = conversations.find(
// 				(conversation) => conversation.participants[0]._id === searchedUser._id
// 			);

// 			if (conversationAlreadyExists) {
// 				setSelectedConversation({
// 					_id: conversationAlreadyExists._id,
// 					userId: searchedUser._id,
// 					username: searchedUser.username,
// 					userProfilePic: searchedUser.profilePic,
// 				});
// 				return;
// 			}

// 			const mockConversation = {
// 				mock: true,
// 				lastMessage: {
// 					text: "",
// 					sender: "",
// 				},
// 				_id: Date.now(),
// 				participants: [
// 					{
// 						_id: searchedUser._id,
// 						username: searchedUser.username,
// 						profilePic: searchedUser.profilePic,
// 					},
// 				],
// 			};
// 			setConversations((prevConvs) => [...prevConvs, mockConversation]);
// 		} catch (error) {
// 			showToast("Error", error.message, "error");
// 		} finally {
// 			setSearchingUser(false);
// 		}
// 	};

//   return (
// 	<Box
// 			position={"absolute"}
// 			left={"50%"}
// 			w={{ base: "100%", md: "80%", lg: "750px" }}
// 			p={4}
// 			transform={"translateX(-50%)"}
// 		>
// 			<Flex
// 				gap={4}
// 				flexDirection={{ base: "column", md: "row" }}
// 				maxW={{
// 					sm: "400px",
// 					md: "full",
// 				}}
// 				mx={"auto"}
// 			>
// 			 <Flex flex={30}
// 				gap={2}
// 				flexDirection={"column"}
// 				maxW={{ sm: "250px", md: "full" }}
// 				mx={"auto"}
// 			 >
// 				<Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
//                     信息列表 📄
//                 </Text>
// 				<form onSubmit={handleConversationSearch}>
// 					<Flex alignItems={"center"} gap={2}>
// 						<Input placeholder='寻找用户' onChange={(e) => setSearchText(e.target.value)} />
//                         <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
//                             <SearchIcon />
//                         </Button>

// 					</Flex>
// 				</form>

// 				{loadingConversations &&
// 					[0,1,2,3,4].map((_, i) =>(
// 						<Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
// 							<Box>
// 								<SkeletonCircle size={"10"} />
// 							</Box>
// 							<Flex w={"full"} flexDirection={"column"} gap={3}>
//                                 <Skeleton h={"10px"} w={"80px"} />
//                                 <Skeleton h={"8px"} w={"90%"} />
//                             </Flex>
// 						</Flex>
// 					))
// 				}

// 				{!loadingConversations && (
// 				 conversations.map((conversation) => (
// 					<Conversation
// 						key={conversation._id}
// 						isOnline={onlineUsers.includes(conversation.participants[0]._id)}
// 						conversation={conversation}
// 					/>
// 				))
// 				)}

// 			 </Flex>

// 			 {!selectedConversation._id && (
// 			 <Flex 
// 			  flex={70}
// 			  borderRadius={"md"}
// 			  p={2}
// 			  flexDir={"column"}
// 			  alignItems={"center"}
// 			  justifyContent={"center"}
// 			  height={"400px"}
// 			 >
// 			  <PiWechatLogoDuotone size={100}/>
// 			  <Text fontSize={20}>选择一个用户开始聊天 🌐</Text>
// 			 </Flex>
// 			 )}

// 			 {selectedConversation._id && <MessageContainer />}
			

// 			</Flex>
// 		</Box>
// 	);
// };

// export default ChatPage


