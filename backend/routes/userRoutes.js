import express from 'express';
import { signupUser , loginUser, logoutUser, followUnFollowUser,updateUser,
getUserProfile,getSuggestedUsers,getUserFollowers,getUserFollowing,freezeAccount} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get("/profile/:query",getUserProfile)
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login",loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id",protectRoute,followUnFollowUser);
router.put("/update/:id",protectRoute,updateUser);
router.get("/:id/followers", protectRoute, getUserFollowers);  // 新增的路由
router.get("/:id/following", protectRoute, getUserFollowing);  // 新增的路由
router.put("/freeze", protectRoute, freezeAccount);
export default router;