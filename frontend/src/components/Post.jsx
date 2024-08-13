import {Avatar,useToast} from '@chakra-ui/react'
import {Box, Flex, Image, Text} from '@chakra-ui/react'
import { BsThreeDots } from "react-icons/bs";
import Actions from './Actions'
import { useState, useEffect } from 'react'; 
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { Link,useNavigate } from'react-router-dom';
import {formatDistanceToNow} from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons";
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useRecoilState } from "recoil";
import postsAtom from '../atoms/postsAtom';

const Post = ({post,postedBy}) => {
    const showToast = useShowToast();
    const [user, setUser] = useState(null);
    const currentUser = useRecoilValue(userAtom)
    const [posts, setPosts] = useRecoilState(postsAtom);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setUser(null);
			}
		};

		getUser();
	}, [postedBy, showToast]);

    const handleDeletePost = async (e) => {
		try {
			e.preventDefault();
			if (!window.confirm("您确定要删除这条帖子吗?")) return;

			const res = await fetch(`/api/posts/${post._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "删除成功", "success");
			setPosts(posts.filter((p) => p._id !== post._id));
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};


    if (!user) return null;

    const copyURL = () => {
        const currentURL = `${window.location.origin}/${user.username}/post/${post._id}`;
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "链接已复制",
                description: "帖子链接已复制到剪贴板",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }).catch(() => {
            toast({
                title: "复制失败",
                description: "无法复制链接，请稍后再试",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    };
    const handleMenuClick = (e) => {
        e.preventDefault(); // 阻止默认行为（如有必要）
        copyURL();
    };

    

  return (
   <Link to={`/${user.username}/post/${post._id}`}>
   <Flex gap={3} mb={4} py={5}>
   <Flex flexDirection={"column"} alignItems={"center"}>
       <Avatar size='md' name={user.name} src={user?.profilePic}
         onClick={(e)=>{
            e.preventDefault();
            navigate(`/${user.username}`);
         }}
       
       />
       <Box w='1px' h={"full"} bg='gray.light' my={2}></Box>
       <Box position={"relative"} w={"full"}>
        {post.replies.length === 0 && <Text textAlign={"center"}>👀</Text>}
        {post.replies[0] &&(
          <Avatar 
               size='xs'
               name='John doe'
               src={post.replies[0].userProfilePic}
               position={"absolute"}
               top={"0px"}
               left='15px'
               padding={"2px"}
          />)}
        
        {post.replies[1] &&(
            <Avatar
                size='xs'
                name='John doe'
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right='-5px'
                padding={"2px"}
            />
        )}

        {post.replies[2] &&(
             <Avatar
               size='xs'
               name='John doe'
               src={post.replies[2].userProfilePic}
               position={"absolute"}
               bottom={"0px"}
               left='4px'
               padding={"2px"}
           />
        )}
      
          
       </Box>
   </Flex>
   <Flex flex={1} flexDirection={"column"} gap={2}>
       <Flex justifyContent={"space-between"} w={"full"}>
           <Flex w={"full"} alignItems={"center"}>
               <Text fontSize={"sm"} fontWeight={"bold"}
                 onClick={(e)=>{
                    e.preventDefault();
                    navigate(`/${user.username}`);
                 }}
               >
                   {user?.username}
               </Text>
               <Image src='/verified.png' w={4} h={4} ml={1} />
           </Flex>
           <Flex gap={4} alignItems={"center"}>
               <Text fontSize={"sm"} width={36} textAlign={"right"} color={"gray.light"}>
                   {formatDistanceToNow(new Date(post.createdAt))} ago
               </Text>

               {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost}/>}
     
               <Menu>
                    <MenuButton onClick={handleMenuClick}>
                        <BsThreeDots />
                    </MenuButton>
                    <MenuList bg={"gray.dark"}>
                        <MenuItem bg={"gray.dark"} onClick={handleMenuClick}>
                            Copy link
                        </MenuItem>
                    </MenuList>
                </Menu>
           </Flex>
       </Flex>

       <Text fontSize={"sm"}>{post.text}</Text>
       {post.img && (
         <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
               <Image src={post.img} w={"full"} />
           </Box>
       )}
       
          
       <Flex gap={3} my={1}>
           <Actions post={post} />
       </Flex>

   </Flex>
</Flex>
   </Link>
  )
}

export default Post;
