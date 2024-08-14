import { Flex, Text, Avatar, Divider, Icon } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'; // 导入删除图标
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const Comment = ({ reply, lastReply, onDelete }) => {
  const currentUser = useRecoilValue(userAtom); // 获取当前用户信息

  const handleDelete = () => {
    if (window.confirm('确定要删除这条评论吗？')) {
      onDelete(reply._id); // 传递评论ID给父组件
    }
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            <Text fontSize='sm' fontWeight='bold'>
              {reply.username}
            </Text>

            {/* 如果当前用户是评论作者，则显示删除图标 */}
            {currentUser?._id === reply.userId && (
              <Icon as={DeleteIcon} cursor="pointer" onClick={handleDelete} _hover={{ color: 'red.500' }} />
            )}
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>

      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;








// import { Flex, Text, Avatar, Divider } from '@chakra-ui/react'

// // Comment 组件接收两个 props: reply 和 lastReply
// const Comment = ({ reply, lastReply }) => {
//   return (
//     <>
//       {/* 外层 Flex 容器，用于排列头像和文本。gap 定义子元素之间的间距，py 和 my 用于设置上下内外边距 */}
//       <Flex gap={4} py={2} my={2} w={"full"}>
//         <Avatar src={reply.userProfilePic} size={"sm"} />
        
//         {/* 另一个 Flex 容器，用于垂直排列用户名和评论文本 */}
//         <Flex gap={1} w={"full"} flexDirection={"column"}>
//           {/* 显示用户名和其他元素的容器。justifyContent 设置为 space-between，使内容两端对齐 */}
//           <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
//             {/* 显示用户名，Text 组件用于文本显示，fontSize 和 fontWeight 控制字体大小和粗细 */}
//             <Text fontSize='sm' fontWeight='bold'>
//               {reply.username}
//             </Text>
//           </Flex>
//           {/* 显示评论文本 */}
//           <Text>{reply.text}</Text>
//         </Flex>
//       </Flex>

//       {/* 如果不是最后一个回复，显示一个分割线，否则不显示 */}
//       {!lastReply ? <Divider /> : null}
//     </>
//   );
// };

// export default Comment;