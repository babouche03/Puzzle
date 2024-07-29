import express from 'express';
import dotenv from "dotenv";
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js'; 
import postRoutes from './routes/postRoutes.js';

dotenv.config();
//通过 dotenv 加载 .env 文件中的环境变量到 process.env

connectDB();//连接mongodb数据库
const app = express();

const PORT=process.env.PORT || 5174;

//中间件
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
// app.use("/api/messages", messageRoutes);

app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));