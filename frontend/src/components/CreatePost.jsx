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
import { BsFillImageFill } from "react-icons/bs";
import { useState, useRef } from "react";
import { AddIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const [imgUrls, setImgUrls] = useState([]); // 用于存储多个图片 URL
    const imageRef = useRef(null);
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

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newImgUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newImgUrls.push(reader.result);
                if (newImgUrls.length === files.length) {
                    setImgUrls((prev) => [...prev, ...newImgUrls]); // 添加到现有的图片 URL 数组中
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
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrls }), // 发送所有图片 URL
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
            // 清空输入框和图片
            onClose();
            setPostText("");
            setImgUrls([]);
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

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} multiple /> {/* 添加 multiple 属性以支持多图上传 */}

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={22}
                                onClick={() => imageRef.current.click()}
                            />
                        </FormControl>

                        {imgUrls.length > 0 && (
                            <Flex mt={5} w={"full"} wrap="wrap"> {/* 使用 wrap="wrap" 使图片在行中自动换行 */}
                                {imgUrls.map((url, index) => (
                                    <Flex key={index} position={"relative"} m={2}>
                                        <Image src={url} alt={`Selected img ${index + 1}`} boxSize="100px" objectFit="cover" /> {/* 调整 boxSize 以控制图片大小 */}
                                        <CloseButton
                                            onClick={() => {
                                                setImgUrls(imgUrls.filter((_, i) => i !== index)); // 删除选定的图片
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