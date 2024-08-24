import path from "path";
import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'; 
import postRoutes from './routes/postRoutes.js';
import {v2 as cloudinary} from "cloudinary";
import bodyParser from "body-parser";
import messageRoutes from './routes/messageRoutes.js';
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";

dotenv.config();
//通过 dotenv 加载 .env 文件中的环境变量到 process.env

connectDB();//连接mongodb数据库
job.start();


// 增加请求负载限制
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));


const PORT=process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//中间件
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// http://localhost:5001 => backend,frontend

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));