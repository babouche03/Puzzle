import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, Icon, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure } from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons";

import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
    const { user, loading } = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const { pid } = useParams();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();
    

    const currentPost = posts[0];
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState(null); // 保存被选中的图片

    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts([data]);
            } catch (error) {
                showToast("Error", error.message, "error");
            }
        };
        getPost();
    }, [showToast, pid, setPosts]);

    const handleDeletePost = async () => {
        try {
            if (!window.confirm("您确定要删除这条帖子吗?")) return;

            const res = await fetch(`/api/posts/${currentPost._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "删除成功", "success");
            navigate(`/${user.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!currentPost) return null;

    // 返回功能
    const handleBack = () => {
        navigate(-1); // 返回到之前的页面
    };

    // 处理图片点击事件，打开模态框并设置选中的图片
    const handleImageClick = (url) => {
        setSelectedImage(url);
        onOpen();
    };
    //删除评论
	const handleDeleteComment = async (commentId) => {
		try {
			const res = await fetch(`/api/posts/${currentPost._id}/comment/${commentId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "删除评论成功", "success");
	
			// 更新帖子状态
			const updatedPost = {
				...currentPost,
				replies: currentPost.replies.filter((reply) => reply._id !== commentId),
			};
			setPosts([updatedPost]);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};
	

    return (
        <>
            {/* 返回按钮 */}
            <Icon
                as={ArrowBackIcon}
                boxSize={7} // 设置箭头图标大小
                cursor="pointer" // 添加手型指针，表明它是可点击的
                onClick={handleBack} // 点击事件处理
                _hover={{ color: 'gray.500' }} // 悬停时更改颜色
                mt={8}
                mb={10}
            />

            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar src={user.profilePic} size={"md"} name='Mark Zuckerberg' />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.username}
                        </Text>
                        <Image src='/verified.png' w='4' h={4} ml={4} />
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                    </Text>

                    {currentUser?._id === user._id && (
                        <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
                    )}
                </Flex>
            </Flex>

            <Text my={3}>{currentPost.text}</Text>

            {currentPost.img && Array.isArray(currentPost.img) && currentPost.img.length > 0 && (
                currentPost.img.length === 1 ? (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                        <Image src={currentPost.img[0]} w={"full"} onClick={() => handleImageClick(currentPost.img[0])} cursor="pointer" />
                    </Box>
                ) : (
                    <Flex flexWrap="wrap" gap={2}>
                        {currentPost.img.map((url, index) => (
                            <Box
                                key={index}
                                w="48%"
                                borderRadius={6}
                                overflow={"hidden"}
                                border={"1px solid"}
                                borderColor={"gray.light"}
                                cursor="pointer"
                                onClick={() => handleImageClick(url)}
                            >
                                <Image src={url} w={"full"} h={"150px"} objectFit={"cover"} />
                            </Box>
                        ))}
                    </Flex>
                )
            )}

            <Flex gap={3} my={3}>
                <Actions post={currentPost} />
            </Flex>

            <Divider my={4} />

            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />
            {currentPost.replies.map((reply) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
					onDelete={handleDeleteComment}
                />
            ))}

            {/* 图片模态框 */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">  {/* 修改这里的 size */}
                <ModalOverlay />
                <ModalContent maxW="70%" maxH="80%">  {/* 设置宽度为屏幕的70%，高度为80% */}
                    <ModalBody p={0}>
                        {selectedImage && (
                            <Image src={selectedImage} w="full" h="full" objectFit="contain" onClick={onClose} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default PostPage;