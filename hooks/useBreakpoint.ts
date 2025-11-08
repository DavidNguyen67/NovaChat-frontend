/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

// Breakpoints mặc định của Tailwind
const breakpoints = {
  sm: 640, // mobile → tablet
  md: 768, // tablet → small laptop
  lg: 1024, // laptop → desktop
  xl: 1280,
  '2xl': 1536,
};

const useBreakPoint = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize(); // Gọi ngay lần đầu
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Xác định device hiện tại
  const isMobile = width < breakpoints.md; // nhỏ hơn 768px
  const isTablet = width >= breakpoints.md && width < breakpoints.lg;
  const isLaptop = width >= breakpoints.lg && width < breakpoints.xl;
  const isDesktop = width >= breakpoints.xl;

  // Trả ra object để dễ dùng
  return { width, isMobile, isTablet, isLaptop, isDesktop };
};

export default useBreakPoint;
