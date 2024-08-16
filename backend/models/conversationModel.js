import mongoose from "mongoose";

// 定义对话的 Schema，包含 participants 和 lastMessage 字段
const conversationSchema = new mongoose.Schema(
  {
    // participants 字段是一个数组，存储参与对话的用户 ID
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // lastMessage 字段包含了对话的最后一条消息信息
    lastMessage: {
      // text 用于存储消息的文本内容
      text: String,

      // sender 存储发送这条消息的用户 ID
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

      // seen 用于标识这条消息是否已被读取，默认值为 false
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true } // timestamps 选项会自动为每个文档添加 createdAt 和 updatedAt 字段
);

// 创建并导出 Conversation 模型
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;