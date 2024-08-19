import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user?._id) return; // 如果用户未登录，跳过Socket连接
	  
		const socket = io("http://localhost:5001", {
		  query: {
			userId: user._id,
		  },
		});
	  
		setSocket(socket);
	  
		socket.on("getOnlineUsers", (users) => {
		  setOnlineUsers(users);
		});
	  
		return () => socket && socket.close();
	  }, [user?._id]); // 依赖user._id，当它变化时重新连接Socket

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
