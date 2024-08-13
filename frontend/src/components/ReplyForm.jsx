// components/ReplyForm.js
import { useState } from "react";
import { Button, Input, Flex } from "@chakra-ui/react";

const ReplyForm = ({ onSubmit }) => {
    const [replyText, setReplyText] = useState("");

    const handleReplySubmit = () => {
        if (replyText.trim()) {
            onSubmit(replyText);
            setReplyText(""); // 清空输入框
        }
    };

    return (
        <Flex mt={2}>
            <Input 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="写下你的回复..." 
            />
            <Button ml={2} onClick={handleReplySubmit}>回复</Button>
        </Flex>
    );
};

export default ReplyForm;