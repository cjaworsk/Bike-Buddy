import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. User agent fallback
    const uaCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);

    // 2. Screen size check (primary method)
    const sizeCheck = window.innerWidth < 768; // tweak breakpoint

    setIsMobile(uaCheck || sizeCheck);

    const handleResize = () => {
      setIsMobile(uaCheck || window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

