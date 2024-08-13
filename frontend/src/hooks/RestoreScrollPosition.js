import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 恢复滚动位置
const RestoreScrollPosition = () => {
  const location = useLocation();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem(location.pathname);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
  }, [location.pathname]);

  return null;
};

export default RestoreScrollPosition;