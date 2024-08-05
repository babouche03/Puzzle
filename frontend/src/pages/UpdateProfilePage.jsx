import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'

import { useRecoilState } from'recoil';
import  userAtom from '../atoms/userAtom';
import { useState, useRef } from'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
		name: user.name,
		username: user.username,
		email: user.email,
		bio: user.bio,
		password: "",
	});
    const fileRef = useRef(null);
    const [updating, setUpdating] = useState(false);

    const showToast = useShowToast();

    const { handleImageChange, imgUrl } = usePreviewImg();
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (updating) return;
      setUpdating(true);
      try {
        const res = await fetch(`/api/users/update/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
        });
        const data = await res.json(); // updated user object
        // console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "个人信息更新成功", "success");
        setUser(data);
        localStorage.setItem("user-threads", JSON.stringify(data));
      } catch (error) {
        showToast("Error", error, "error");
      }  finally {
        setUpdating(false);
      }
    };

  return (
    <form onSubmit={handleSubmit}> 
    <Flex
      my={6}
      align={'center'}
      justify={'center'}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
       >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          个人信息设置
        </Heading>
        <FormControl id="userName">
          
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
               
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>更换头像</Button>
              <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl >
          <FormLabel>真实姓名</FormLabel>
          <Input
            placeholder="RealName"
            value={inputs.name}
			onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl >
          <FormLabel>用户名</FormLabel>
          <Input
            placeholder="UserName"
            value={inputs.username}
			onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl  >
          <FormLabel>邮箱地址</FormLabel>
          <Input
            placeholder="your-email@example.com"
            value={inputs.email}
			onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl >
          <FormLabel>简单说两句</FormLabel>
          <Input
            placeholder="just say something to the world"
            value={inputs.bio}
            onChange={(e) => setInputs({...inputs, bio: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl >
          <FormLabel>账户密码</FormLabel>
          <Input
            placeholder="password"
            value={inputs.password}
            onChange={(e) => setInputs({...inputs, password: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.600'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.700',
            }}>
            取消
          </Button>
          <Button
            bg={'green.600'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.700',
            }}
            type="submit"
            isLoading={updating}
          >
            提交
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
}





