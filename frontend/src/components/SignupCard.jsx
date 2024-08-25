import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import useShowToast from "../hooks/useShowToast";
import authScreenAtom from '../atoms/authAtom'
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // 添加确认密码输入字段
  });

  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handleSignup = async () => {
    if (inputs.password !== inputs.confirmPassword) {
      showToast("Error", "两次密码输入不一致", "error");
      return;
    }

    try {
      // 向 /api/users/signup 发送 POST 请求
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
  
      // 将响应解析为 JSON 格式
      const data = await res.json();
  
      // 如果服务器返回错误信息，显示错误提示并返回
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
  
      // 将用户数据保存到本地存储
      localStorage.setItem("user-threads", JSON.stringify(data));
      // 将用户数据保存到应用状态中
      setUser(data);
    } catch (error) {
      // 捕获并处理任何错误
      console.log(error);
    }
  };

  return (
    <Flex
      minH={'60vh'}
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading textAlign={'center'} class='ma-shan-zheng-regular'>
            注册
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Puzzle —— 让社交更纯粹 🧩
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl>
                  <FormLabel>真实姓名（选填）</FormLabel>
                  <Input type="text" 
                    onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                    value={inputs.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>用户名</FormLabel>
                  <Input type="text" 
                    onChange={(e) => setInputs({...inputs, username: e.target.value })}
                    value={inputs.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl>
              <FormLabel>邮箱地址（选填）</FormLabel>
              <Input type="email"
                onChange={(e) => setInputs({...inputs, email: e.target.value })}
                value={inputs.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>账户密码</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInputs({...inputs, password: e.target.value })}
                  value={inputs.password}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>确认密码</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInputs({...inputs, confirmPassword: e.target.value })}
                  value={inputs.confirmPassword}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue('blue.400', 'blue.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('blue.500', 'blue.800'),
                }}
                onClick={handleSignup}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                我已加入Puzzle ?<Link color={'blue.400'}
                 onClick={() => setAuthScreen('login')}
                >登录</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}