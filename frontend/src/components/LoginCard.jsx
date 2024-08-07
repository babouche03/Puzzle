
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
import authScreenAtom from '../atoms/authAtom'
import { useSetRecoilState } from'recoil'
import useShowToast from '../hooks/useShowToast'
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();

  const handleLogin = async () => {
    setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
      console.log(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally{
      setLoading(false);
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
            登录
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
          w={{
            base: "full",
            sm: '400px',
          }}
          >
          <Stack spacing={4}>
          
            <FormControl isRequired>
              <FormLabel>用户名</FormLabel>
              <Input type="text" 
                value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
              />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>账户密码</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                  value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
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
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue('blue.400', 'blue.700')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('blue.500', 'blue.800'),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Log in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                还未加入Puzzle ?<Link color={'blue.400'}
                 onClick={() => setAuthScreen("signup")}
                > 注册</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}