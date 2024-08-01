import { atom } from "recoil";

const authScreenAtom = atom({
	key: "authScreenAtom",
	default: "login",//默认登录页面
});

export default authScreenAtom;
