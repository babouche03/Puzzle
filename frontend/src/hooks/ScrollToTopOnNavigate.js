import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 记录滚动位置
const ScrollToTopOnNavigate = () => {
  const location = useLocation();

  useEffect(() => {
    // 当用户导航到新页面时，手动记录当前滚动位置
    const handleNavigate = () => {
      const scrollPosition = window.scrollY;
      sessionStorage.setItem(location.pathname, scrollPosition);
    };

    window.addEventListener("popstate", handleNavigate);

    return () => {
      window.removeEventListener("popstate", handleNavigate);
    };
  }, [location.pathname]);

  return null;
};

export default ScrollToTopOnNavigate;