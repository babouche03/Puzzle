import express from "express";
import { createPost ,getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, deleteComment,hugUnhugPost,getLikeUsers,getHugUsers } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute,createPost);
router.delete("/:id", protectRoute,deletePost);
router.put("/like/:id", protectRoute,likeUnlikePost);
router.put("/hug/:id", protectRoute, hugUnhugPost); // 添加安慰路由
router.put("/reply/:id", protectRoute,replyToPost);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);
router.get('/likes/:postId', getLikeUsers);
router.get('/hugs/:postId', getHugUsers);

export default router;