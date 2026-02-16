// Hook personalizado para detectar breakpoints responsivos
import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface UseResponsiveReturn {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    breakpoint: Breakpoint;
    width: number;
}

export function useResponsive(): UseResponsiveReturn {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    const isDesktop = windowSize.width >= 1024;

    let breakpoint: Breakpoint = 'desktop';
    if (isMobile) breakpoint = 'mobile';
    else if (isTablet) breakpoint = 'tablet';

    return {
        isMobile,
        isTablet,
        isDesktop,
        breakpoint,
        width: windowSize.width,
    };
}
