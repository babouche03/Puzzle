import mongoose from "mongoose"; 

// 定义消息的 Schema（数据模型）
const messageSchema = new mongoose.Schema(
  {
    // 定义字段 conversationId，表示消息所属的对话，它是一个引用类型，引用了 Conversation 模型
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    
    // 定义字段 sender，表示消息的发送者，它是一个引用类型，引用了 User 模型
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
    // 定义字段 text，表示消息的文本内容
    text: String,
    
    // 定义字段 seen，表示消息是否已读，默认值为 false
    seen: {
      type: Boolean,
      default: false,
    },
    
    // 定义字段 img，表示消息中可能附带的图片，默认值为空字符串
    img: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // 启用时间戳，Mongoose 会自动添加 createdAt 和 updatedAt 字段
);

// 基于上述 Schema 创建并导出 Message 模型
const Message = mongoose.model("Message", messageSchema);

export default Message;