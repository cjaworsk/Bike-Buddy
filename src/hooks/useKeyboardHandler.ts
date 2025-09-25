import { useEffect } from 'react';

export const useKeyboardHandler = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    
    const visualViewport = window.visualViewport; // Store reference
    const initialHeight = visualViewport.height;
    
    const handleViewportResize = () => {
      if (!visualViewport) return; // Additional safety check
      
      const currentHeight = visualViewport.height;
      const keyboardHeight = initialHeight - currentHeight;
      
      if (keyboardHeight > 100) {
        document.body.style.position = 'fixed';
        document.body.style.height = initialHeight + 'px';
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
      }
    };
    
    visualViewport.addEventListener('resize', handleViewportResize);
    
    return () => {
      visualViewport.removeEventListener('resize', handleViewportResize);
      document.body.style.position = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);
};
