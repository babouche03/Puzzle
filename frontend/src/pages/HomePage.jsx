import {Flex,Spinner,Box} from '@chakra-ui/react';
import {Link} from 'react-router-dom'
import { useState, useEffect } from 'react';
import { useRecoilState } from'recoil';
import useShowToast from '../hooks/useShowToast';
import postsAtom from "../atoms/postsAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = ()=> {

    const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch("/api/posts/feed");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				// console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast,setPosts]);

    return(
      <Flex gap="10" flexDirection={{ base: 'column', md: 'row' }}>
			{/* Posts section */}
			<Box flex={72}>
				{!loading && posts.length === 0 && <h1>您未关注任何用户，关注后再来看看哦</h1>}

				{loading && (
					<Flex justify="center">
						<Spinner size="xl" />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>

			{/* Suggested users section */}
			<Box
				flex={28}
				order={{ base: 1, md: 2 }}  // On mobile, it will appear after the posts section
				display={{ base: 'block', md: 'block' }}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
       
    );
};

export default HomePage;