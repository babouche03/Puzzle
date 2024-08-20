import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  // 定义状态变量: loading 用于跟踪数据加载状态, suggestedUsers 存储获取到的用户数据
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  
  // 自定义钩子用于显示通知信息
  const showToast = useShowToast();

  // 使用 useEffect 在组件挂载时执行数据获取操作
  useEffect(() => {
    const getSuggestedUsers = async () => {
      // 开始请求时，将 loading 设置为 true
      setLoading(true);
      try {
        // 发送 GET 请求以获取建议的用户列表
        const res = await fetch("/api/users/suggested");
        const data = await res.json();

        // 检查响应中是否有错误信息，如果有则显示错误通知并返回
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // 如果没有错误，则将获取到的用户数据存储在状态中
        setSuggestedUsers(data);
      } catch (error) {
        // 如果请求失败，捕获错误并显示错误通知
        showToast("Error", error.message, "error");
      } finally {
        // 请求完成后，无论成功与否，都将 loading 设置为 false
        setLoading(false);
      }
    };

    // 调用异步函数获取建议的用户
    getSuggestedUsers();
  }, [showToast]); // 依赖项为 showToast，确保更新时重新运行

  return (
    <>
      {/* 标题文字 */}
      <Text mb={4} fontWeight={"bold"} className='ma-shan-zheng-regular1'>
        认识一下
      </Text>
      {/* 布局容器，垂直排列 */}
      <Flex direction={"column"} gap={4}>
        {/* 如果数据加载完成，渲染用户列表 */}
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {/* 如果数据仍在加载，渲染骨架屏 */}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
            >
              {/* 头像骨架屏占位符 */}
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              {/* 用户名和全名骨架屏占位符 */}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              {/* 关注按钮骨架屏占位符 */}
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;



// Loading skeletons for suggested users, if u want to copy and paste as shown in the tutorial

// <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
// 							{/* avatar skeleton */}
// 							<Box>
// 								<SkeletonCircle size={"10"} />
// 							</Box>
// 							{/* username and fullname skeleton */}
// 							<Flex w={"full"} flexDirection={"column"} gap={2}>
// 								<Skeleton h={"8px"} w={"80px"} />
// 								<Skeleton h={"8px"} w={"90px"} />
// 							</Flex>
// 							{/* follow button skeleton */}
// 							<Flex>
// 								<Skeleton h={"20px"} w={"60px"} />
// 							</Flex>
// 						</Flex>
