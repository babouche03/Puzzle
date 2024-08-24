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
		// 保存滚动位置
		const handleScroll = () => {
		//   console.log('Saving scroll position:', window.scrollY);
		  sessionStorage.setItem('scrollPosition', window.scrollY);
		};
	
		window.addEventListener('scroll', handleScroll);
	    return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	  }, []);
	

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
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast,setPosts]);
	
	useEffect(() => {
		// 确保页面完全渲染后再恢复滚动位置
		const restoreScrollPosition = () => {
		  const savedScrollPosition = sessionStorage.getItem('scrollPosition');
		  console.log('Restoring scroll position:', savedScrollPosition);
	
		  if (!loading && savedScrollPosition) {
			requestAnimationFrame(() => {
			  window.scrollTo(0, parseInt(savedScrollPosition, 10));
			});
		  }
		};
	
		restoreScrollPosition();
	  }, [loading, posts]); // 依赖于 loading 和 posts，确保数据加载和渲染完成后恢复滚动位置

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