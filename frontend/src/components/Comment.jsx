import { Flex, Text, Avatar, Divider } from '@chakra-ui/react'

// Comment 组件接收两个 props: reply 和 lastReply
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      {/* 外层 Flex 容器，用于排列头像和文本。gap 定义子元素之间的间距，py 和 my 用于设置上下内外边距 */}
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        
        {/* 另一个 Flex 容器，用于垂直排列用户名和评论文本 */}
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          {/* 显示用户名和其他元素的容器。justifyContent 设置为 space-between，使内容两端对齐 */}
          <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
            {/* 显示用户名，Text 组件用于文本显示，fontSize 和 fontWeight 控制字体大小和粗细 */}
            <Text fontSize='sm' fontWeight='bold'>
              {reply.username}
            </Text>
          </Flex>
          {/* 显示评论文本 */}
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>

      {/* 如果不是最后一个回复，显示一个分割线，否则不显示 */}
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;