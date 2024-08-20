import { Avatar, Box, Flex, Image, Skeleton, Text, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

const Message = ({ ownMessage, message, handleDeleteMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const bgColor = useColorModeValue("gray.400", "gray.600");
  const blueColor = useColorModeValue("blue.300", "blue.500");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const messageRef = useRef(null);
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPopoverOpen(true);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const handleClickOutside = (event) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target) && messageRef.current && !messageRef.current.contains(event.target)) {
      closePopover();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} ref={messageRef} onContextMenu={handleContextMenu}>
          <Popover isOpen={popoverOpen} onClose={closePopover} placement="bottom-end">
            <PopoverTrigger>
              <Box>
                {message.text && (
                  <Flex bg={blueColor} maxW={"350px"} p={1} borderRadius={"md"}>
                    <Text color={"white"}>{message.text}</Text>
                    <Box
                      alignSelf={"flex-end"}
                      ml={1}
                      color={message.seen ? "green.200" : "white"}
                      fontWeight={"bold"}
                    >
                      <BsCheck2All size={14} />
                    </Box>
                  </Flex>
                )}
                {message.img && !imgLoaded && (
                  <Flex mt={5} w={"200px"}>
                    <Image
                      src={message.img}
                      hidden
                      onLoad={() => setImgLoaded(true)}
                      alt="Message image"
                      borderRadius={4}
                    />
                    <Skeleton w={"200px"} h={"200px"} />
                  </Flex>
                )}
                {message.img && imgLoaded && (
                  <Flex mt={5} w={"200px"}>
                    <Image src={message.img} alt="Message image" borderRadius={4} />
                    <Box
                      alignSelf={"flex-end"}
                      ml={1}
                      color={message.seen ? "green.300" : ""}
                      fontWeight={"bold"}
                    >
                      <BsCheck2All size={16} />
                    </Box>
                  </Flex>
                )}
              </Box>
            </PopoverTrigger>
            <PopoverContent width="auto" maxWidth="100px" borderRadius="md" ref={popoverRef} id={message._id}>
              <PopoverBody
                cursor="pointer"
                onClick={() => {
                  handleDeleteMessage(message._id); // 触发删除功能
                  closePopover();
                }}
                bg="gray.600"
                color="white"
                p={1}
                textAlign="center"
				
              >
                撤回
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Avatar src={user.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2} ref={messageRef} onContextMenu={handleContextMenu}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} cursor="pointer"  onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/${selectedConversation.username}`);
                                }} />
          <Popover isOpen={popoverOpen} onClose={closePopover} placement="bottom-start">
            <PopoverTrigger>
              <Box>
                {message.text && (
                  <Text maxW={"350px"} bg={bgColor} p={1} borderRadius={"md"} color={"black"}>
                    {message.text}
                  </Text>
                )}
                {message.img && !imgLoaded && (
                  <Flex mt={5} w={"200px"}>
                    <Image
                      src={message.img}
                      hidden
                      onLoad={() => setImgLoaded(true)}
                      alt="Message image"
                      borderRadius={4}
                    />
                    <Skeleton w={"200px"} h={"200px"} />
                  </Flex>
                )}
                {message.img && imgLoaded && (
                  <Flex mt={5} w={"200px"}>
                    <Image src={message.img} alt="Message image" borderRadius={4} />
                  </Flex>
                )}
              </Box>
            </PopoverTrigger>
        
          </Popover>
        </Flex>
      )}
    </>
  );
};

export default Message;







// import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
// import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
// import { selectedConversationAtom } from "../atoms/messagesAtom";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { BsCheck2All } from "react-icons/bs";
// import { RiCheckboxBlankCircleFill } from "react-icons/ri";
// import { useState } from "react";
// import { useColorModeValue } from "@chakra-ui/react";

// const Message = ({ ownMessage, message, handleDeleteMessage }) => {
// 	const selectedConversation = useRecoilValue(selectedConversationAtom);
// 	const user = useRecoilValue(userAtom);
// 	const [imgLoaded, setImgLoaded] = useState(false);
// 	const bgColor = useColorModeValue("gray.400", "gray.600");
// 	const blueColor = useColorModeValue("blue.300", "blue.500");
	

// 	return (
// 		<>
// 		{ownMessage ? (
// 			<Flex gap={2} alignSelf={"flex-end"}>
// 				<ContextMenuTrigger id={message._id}>
// 					{message.text && (
// 						<Flex bg={blueColor} maxW={"350px"} p={1} borderRadius={"md"}>
// 							<Text color={"white"}>{message.text}</Text>
// 							<Box
// 								alignSelf={"flex-end"}
// 								ml={1}
// 								color={message.seen ? "green.200" : "white"}
// 								fontWeight={"bold"}
// 							>
// 								<BsCheck2All size={14} />
// 							</Box>
// 						</Flex>
// 					)}
// 					{message.img && !imgLoaded && (
// 						<Flex mt={5} w={"200px"}>
// 							<Image
// 								src={message.img}
// 								hidden
// 								onLoad={() => setImgLoaded(true)}
// 								alt='Message image'
// 								borderRadius={4}
// 							/>
// 							<Skeleton w={"200px"} h={"200px"} />
// 						</Flex>
// 					)}
// 					{message.img && imgLoaded && (
// 						<Flex mt={5} w={"200px"}>
// 							<Image src={message.img} alt='Message image' borderRadius={4} />
// 							<Box
// 								alignSelf={"flex-end"}
// 								ml={1}
// 								color={message.seen ? "green.300" : ""}
// 								fontWeight={"bold"}
// 							>
// 								<BsCheck2All size={16} />
// 							</Box>
// 						</Flex>
// 					)}
// 				</ContextMenuTrigger>
// 				<Avatar src={user.profilePic} w='7' h={7} />
// 			</Flex>
// 		) : (
// 			<Flex gap={2}>
// 				<Avatar src={selectedConversation.userProfilePic} w='7' h={7} />
// 				<ContextMenuTrigger id={message._id}>
// 					{message.text && (
// 						<Text maxW={"350px"} bg={bgColor} p={1} borderRadius={"md"} color={"black"}>
// 							{message.text}
// 						</Text>
// 					)}
// 					{message.img && !imgLoaded && (
// 						<Flex mt={5} w={"200px"}>
// 							<Image
// 								src={message.img}
// 								hidden
// 								onLoad={() => setImgLoaded(true)}
// 								alt='Message image'
// 								borderRadius={4}
// 							/>
// 							<Skeleton w={"200px"} h={"200px"} />
// 						</Flex>
// 					)}
// 					{message.img && imgLoaded && (
// 						<Flex mt={5} w={"200px"}>
// 							<Image src={message.img} alt='Message image' borderRadius={4} />
// 						</Flex>
// 					)}
// 				</ContextMenuTrigger>
// 			</Flex>
// 		)}

// 		{/* 右键菜单
// 		<ContextMenu id={message._id}>
// 			<MenuItem onClick={() => handleDeleteMessage(message._id)} style={{ padding: '8px 16px', backgroundColor: bgColor, borderRadius: '8px', cursor: 'pointer', marginBottom: '5px' }}>
// 				删除消息
// 			</MenuItem>
// 		</ContextMenu> */}
// 	</>
// 	);
// };

// export default Message;



