import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import mongoose from "mongoose";
import { v2 as cloudinary} from "cloudinary";

//Signup user
const signupUser = async(req,res) =>{
    try {
		const { name, email, username, password } = req.body;
		// 验证是否所有必填字段都已填写
		if (!username || !password) {
			return res.status(400).json({ error: "你不填用户名和密码我很难办" });
		  }
		// 验证密码长度
		if (password.length < 6) {
			return res.status(400).json({ error: "密码至少6位,你是真不怕被盗号啊" });
		  }

		const user = await User.findOne({ username }); //使用 User.findOne 方法在数据库中查找是否存在相同username 的用户

		if (user) {
			return res.status(400).json({ error: "用户名已存在,换个名字吧" });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt); //对密码进行加密

		const newUser = new User({
			name: name || "",  // 可选字段
			email: email || "", // 可选字段
			username,
			password: hashedPassword,
		});
		await newUser.save(); //将新用户保存至数据库

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);

			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

// Login user
const loginUser = async(req,res) => {
	try {
		console.log("Received login request with body:", req.body); // 打印请求体
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
		
		if (!user || !isPasswordCorrect) return res.status(400).json({ error: "用户名或密码错误❌" });

		if (user.isFrozen) {
			user.isFrozen = false;
			await user.save();
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
			bio: user.bio,
			profilePic: user.profilePic,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in loginUser: ", error.message);
	}
};

// Logout user
const logoutUser = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

// Follow user
const followUnFollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
};

//update user profile
const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });//防止修改其他账号信息

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

// get user profile
const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

    try {
        let user;
        // 如果 query 是有效的 ObjectId
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            // 如果 query 是用户名（忽略大小写）
            user = await User.findOne({ username: new RegExp(`^${query}$`, 'i') }).select("-password").select("-updatedAt");
        }

        if (!user) return res.status(404).json({ error: "用户不存在" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getUserProfile: ", err.message);
    }
  };

  const getSuggestedUsers = async (req, res) => {
	try {
	  // 从请求中获取当前用户的 ID
	  const userId = req.user._id;
  
	  // 查找当前用户的已关注列表
	  const usersFollowedByYou = await User.findById(userId).select("following");
  
	  // 使用 MongoDB 聚合管道获取排除当前用户的随机用户列表
	  const users = await User.aggregate([
		{
		  // 排除当前用户自身
		  $match: {
			_id: { $ne: userId },
		  },
		},
		{
		  // 随机抽取 10 个用户
		  $sample: { size: 10 },
		},
	  ]);
  
	  // 过滤出尚未关注的用户
	  const filteredUsers = users.filter(
		(user) => !usersFollowedByYou.following.includes(user._id)
	  );
  
	  // 只保留前 4 个用户作为建议
	  const suggestedUsers = filteredUsers.slice(0, 4);
  
	  // 为确保安全性，将所有建议用户的密码字段设为 null
	  suggestedUsers.forEach((user) => (user.password = null));
  
	  // 返回状态码 200 和建议用户列表的 JSON 数据
	  res.status(200).json(suggestedUsers);
	} catch (error) {
	  // 捕获错误并返回状态码 500 和错误信息
	  res.status(500).json({ error: error.message });
	}
  };

  // 获取用户的关注者
const getUserFollowers = async (req, res) => {
	try {
		// 通过ID查找用户
		const user = await User.findById(req.params.id).select("followers");
		if (!user) return res.status(404).json({ error: "用户未找到" });

		// 查询关注者的详细信息
		const followers = await User.find({ _id: { $in: user.followers } }).select("username name profilePic");
		res.status(200).json(followers);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in getUserFollowers: ", error.message);
	}
};

// 获取用户正在关注的人
const getUserFollowing = async (req, res) => {
	try {
		// 通过ID查找用户
		const user = await User.findById(req.params.id).select("following");
		if (!user) return res.status(404).json({ error: "用户未找到" });

		// 查询正在关注的用户的详细信息
		const following = await User.find({ _id: { $in: user.following } }).select("username name profilePic");
		res.status(200).json(following);
	} catch (error) {
		res.status(500).json({ error: error.message });
		console.log("Error in getUserFollowing: ", error.message);
	}
};
//冻结账户
const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(400).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


export {signupUser, loginUser,logoutUser,followUnFollowUser,updateUser,getUserProfile,getSuggestedUsers,getUserFollowers,getUserFollowing,freezeAccount};