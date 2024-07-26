import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <> 
     <UserHeader />
     <UserPost likes={1000} replies={100} postImg="/post1.png" postTitle="This is the first post."/>
     <UserPost likes={231} replies={17} postImg="/post2.png" postTitle="This is the 2nd post."/>
     <UserPost likes={1000} replies={100} postImg="/post3.png" postTitle="This is the 3rd post."/>
     <UserPost likes={120} replies={200} postTitle="This is the 4rd post."/>
    </>

  )
}

export default UserPage;
