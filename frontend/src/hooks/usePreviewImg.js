import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.readAsDataURL(file);
		} else {
			showToast("Invalid file type", " Please select an image file", "error");
			setImgUrl(null);
		}
	};
    // console.log(imgUrl);
	return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;

//  usePreviewImg 是一个自定义 Hook，用于处理图像文件的选择和预览。
// 	它使用 useState 管理图像 URL 状态，并使用 useShowToast 显示错误提示。
// 	handleImageChange 函数处理文件输入改变事件，验证文件类型并读取图像数据。
//  该 Hook 提供了简洁的接口，可以在多个组件中重用图像处理逻辑。
