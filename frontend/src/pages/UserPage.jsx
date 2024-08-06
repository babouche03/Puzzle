import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import UserPost from "../components/UserPost";

const UserPage = () => {
  const [user,setUser] = useState(null);
  const { username } =useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
		
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if(data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
        setLoading(false);
      }
		};

		getUser();
	}, [username, showToast]);

  if(!user && loading) {
    return (
      <Spinner size="xl" />
    )
  }

  if (!user && !loading) return <h1>未找到用户</h1>;
			
  return (
    <> 
     <UserHeader user={user} />
     <UserPost likes={1000} replies={100} postImg="/post1.png" postTitle="This is the first post."/>
     <UserPost likes={231} replies={17} postImg="/post2.png" postTitle="This is the 2nd post."/>
     <UserPost likes={1000} replies={100} postImg="/post3.png" postTitle="This is the 3rd post."/>
     <UserPost likes={120} replies={200} postTitle="This is the 4rd post."/>
    </>

  )
}

export default UserPage;
