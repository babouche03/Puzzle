import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
    try {
        // 从请求中提取字段
		const { postedBy, text } = req.body;
		let { img } = req.body;

        // 检查必需字段
		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}
        // 查找用户
		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
        // 验证用户是否有权限创建帖子
		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

        // 检查文本长度
		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}
        // 上传图片
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}
        // 创建并保存新帖子
		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
}


export { createPost };