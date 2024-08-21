import { Container, Box } from '@chakra-ui/react'
import { Route,Routes,Navigate,useLocation } from 'react-router-dom'
import UserPage from "./pages/UserPage"
import PostPage from './pages/PostPage'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import Header from './components/Header'
import { useRecoilValue } from'recoil';
import  userAtom  from './atoms/userAtom';
import UpdateProfilePage from './pages/UpdateProfilePage';
import CreatePost from './components/CreatePost';



function App() {
  const user = useRecoilValue(userAtom);
  const location = useLocation();
  const { pathname } = useLocation();

  // Check if the current path matches "/:username/post/:pid"
  const hideHeader = /^\/[^/]+\/post\/[^/]+$/.test(location.pathname);
  return (
  <Box position={"relative"} w='full'>
    <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "720px"}>

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
        <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
      </Routes>

      
    </Container>
  </Box>

  )
}

export default App
