import { Container } from '@chakra-ui/react'
import { Route,Routes,Navigate,useLocation } from 'react-router-dom'
import UserPage from "./pages/UserPage"
import PostPage from './pages/PostPage'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import Header from './components/Header'
import { useRecoilValue } from'recoil';
import  userAtom  from './atoms/userAtom';
import UpdateProfilePage from './pages/UpdateProfilePage';
import CreatePost from './components/CreatePost';

// 导入滚动位置保存与恢复的钩子
import ScrollToTopOnNavigate from './hooks/ScrollToTopOnNavigate';
import RestoreScrollPosition from './hooks/RestoreScrollPosition';
function App() {
  const user = useRecoilValue(userAtom);
  const location = useLocation();

  // Check if the current path matches "/:username/post/:pid"
  const hideHeader = /^\/[^/]+\/post\/[^/]+$/.test(location.pathname);
  return (
    <Container maxW="620px">
      {/* 调用滚动位置保存与恢复钩子 */}
      <ScrollToTopOnNavigate />
      <RestoreScrollPosition />

      {!hideHeader && <Header />}
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path='update' element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
        <Route path="/:username" element={ user ?
        ( <>
          <UserPage />
          <CreatePost />
          </>        
        ) : (
        <UserPage /> )
        } /> 
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

      
      
    </Container>


  )
}

export default App
