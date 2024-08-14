import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import{v2 as cloudinary} from "cloudinary";
//创建帖子
const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let { img } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ error: "帖子内容不能为空" });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: "用户未找到" });
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "无权创建帖子" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `文本长度必须小于 ${maxLength} 字符` });
        }

        // 检查图片数量
        if (img && img.length > 4) {
            return res.status(400).json({ error: "最多可以上传 4 张图片" });
        }

        // 上传图片
        const imgUrls = [];
        if (img) {
            for (const image of img) {
                const uploadedResponse = await cloudinary.uploader.upload(image, {
                    // 不使用上传预设
                });
                imgUrls.push(uploadedResponse.secure_url);
            }
        }

        const newPost = new Post({ postedBy, text, img: imgUrls });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};
//获取帖子
const getPost = async (req, res) => {
    try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
//删除帖子
const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// 权限验证
		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		// 删除关联的图片
		if (post.img && Array.isArray(post.img)) {
			for (const imgUrl of post.img) {
				const imgId = imgUrl.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(imgId);
			}
		}

		// 删除帖子
		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
//喜欢帖子
const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
//评论帖子
const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "评论内容不能为空" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// 删除评论
const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = post.replies.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // 权限验证：只有评论作者可以删除评论
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete comment" });
        }

        // 使用 Mongoose 的 pull 方法删除评论
        post.replies.pull(commentId);
        await post.save();

        res.status(200).json({ message: "评论删除成功" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//获取用户关注的所有人的帖子，并按创建时间降序排序
const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export { createPost, getPost, deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPosts,deleteComment} 