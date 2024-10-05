import {
    Button,
    CloseButton,
    Flex,
    FormControl,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import { BsFillImageFill, BsFillCameraVideoFill } from "react-icons/bs"; // 引入视频图标
import { useState, useRef } from "react";
import { AddIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;
const MAX_IMAGES = 4;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const [mediaUrls, setMediaUrls] = useState([]); // 用于存储图片或视频 URL
    const imageRef = useRef(null);
    const videoRef = useRef(null); // 用于视频上传
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const { username } = useParams();

    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    const handleMediaChange = (e, type) => {
        const files = e.target.files;
    
        if (type === "image" && mediaUrls.some((media) => media.type === "video")) {
            showToast("Error", "你已上传视频，不能再上传图片", "error");
            return;
        }
    
        if (type === "video" && mediaUrls.length > 0) {
            showToast("Error", "只能上传一段视频或最多四张图片", "error");
            return;
        }
    
        const newMediaUrls = [];
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                newMediaUrls.push({ type, url: reader.result });
                if (newMediaUrls.length === files.length) {
                    setMediaUrls((prev) => Array.isArray(prev) ? [...prev, ...newMediaUrls] : newMediaUrls); // 确保 mediaUrls 是数组
                }
            };
    
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePost = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: mediaUrls }), // 发送所有媒体 URL
            });

            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "帖子发布成功", "success");
            if (username === user.username) {
                setPosts([data, ...posts]);
            }
            // 清空输入框和媒体
            onClose();
            setPostText("");
            setMediaUrls([]);
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.700")}
                onClick={onOpen}
                size={{ base: "sm", sm: "md" }}
            >
                <AddIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>创建帖子</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='讲两句..'
                                onChange={handleTextChange}
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={(e) => handleMediaChange(e, "image")} multiple accept="image/*" /> {/* 支持多图上传 */}
                            <Input type='file' hidden ref={videoRef} onChange={(e) => handleMediaChange(e, "video")} accept="video/*" /> {/* 仅支持单段视频上传 */}

                            <Flex>
                                <BsFillImageFill
                                    style={{ marginLeft: "5px", cursor: "pointer" }}
                                    size={22}
                                    onClick={() => imageRef.current.click()}
                                />
                                <BsFillCameraVideoFill
                                    style={{ marginLeft: "10px", cursor: "pointer" }}
                                    size={22}
                                    onClick={() => videoRef.current.click()}
                                />
                            </Flex>
                        </FormControl>

                        {Array.isArray(mediaUrls) && mediaUrls.length > 0 && ( // 检查 mediaUrls 是否是数组
                            <Flex mt={5} w={"full"} wrap="wrap"> {/* 使用 wrap="wrap" 使媒体在行中自动换行 */}
                                {mediaUrls.map((media, index) => (
                                    <Flex key={index} position={"relative"} m={2}>
                                        {media.type === "image" ? (
                                            <Image src={media.url} alt={`Selected img ${index + 1}`} boxSize="100px" objectFit="cover" /> 
                                        ) : (
                                            <video src={media.url} width="100px" controls />
                                        )}
                                        <CloseButton
                                            onClick={() => {
                                                setMediaUrls((prev) => Array.isArray(prev) ? prev.filter((_, i) => i !== index) : prev); // 防御性 filter 检查
                                            }}
                                            bg={"gray.600"}
                                            position={"absolute"}
                                            top={2}
                                            right={2}
                                        />
                                    </Flex>
                                ))}
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost}
                            isLoading={loading}
                        >
                            发布
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;