// components/SmartScroll.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SmartScrollProps {
  section: string;           // Target section id (e.g., "services")
  offset?: number;           // Offset in pixels for fixed headers
  behavior?: ScrollBehavior; // Scroll behavior: "smooth" or "auto"
  onScrollStart?: () => void; // Callback when scrolling starts
  onScrollEnd?: () => void;   // Callback when scrolling ends
}

interface LocationState {
  scrollToSection?: string;
  scrollOffset?: number;
  scrollBehavior?: ScrollBehavior;
}

const SmartNavigation = ({ 
  section,
  offset = 0,
  behavior = "smooth",
  onScrollStart,
  onScrollEnd,
}: SmartScrollProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    const scrollToSection = (): void => {
      const element = document.getElementById(section);
      if (!element) {
        console.warn(`Element with id "${section}" not found`);
        return;
      }

      if (onScrollStart) onScrollStart();
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });

      if (behavior === 'smooth' && onScrollEnd) {
        const checkScrollEnd = (): void => {
          const currentPosition = window.pageYOffset;
          if (Math.abs(currentPosition - offsetPosition) < 5) {
            onScrollEnd();
            window.removeEventListener('scroll', checkScrollEnd);
          }
        };
        window.addEventListener('scroll', checkScrollEnd);
        setTimeout(() => {
          window.removeEventListener('scroll', checkScrollEnd);
          if (onScrollEnd) onScrollEnd();
        }, 1000);
      } else if (onScrollEnd) {
        onScrollEnd();
      }
    };

    // Auto-scroll when component mounts if triggered by navigation
    if (state?.scrollToSection === section) {
      setTimeout(() => {
        scrollToSection();
        // Clear state after scrolling
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location, section, state, offset, behavior, onScrollStart, onScrollEnd]);

  // Execute scroll immediately if already on home
  useEffect(() => {
    const scrollToSection = (): void => {
      const element = document.getElementById(section);
      if (!element) {
        console.warn(`Element with id "${section}" not found`);
        return;
      }

      if (onScrollStart) onScrollStart();
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: behavior
      });

      if (behavior === 'smooth' && onScrollEnd) {
        const checkScrollEnd = (): void => {
          const currentPosition = window.pageYOffset;
          if (Math.abs(currentPosition - offsetPosition) < 5) {
            onScrollEnd();
            window.removeEventListener('scroll', checkScrollEnd);
          }
        };
        window.addEventListener('scroll', checkScrollEnd);
        setTimeout(() => {
          window.removeEventListener('scroll', checkScrollEnd);
          if (onScrollEnd) onScrollEnd();
        }, 1000);
      } else if (onScrollEnd) {
        onScrollEnd();
      }
    };

    if (location.pathname === '/') {
      scrollToSection();
    } else {
      // Navigate to home with state
      navigate('/', { 
        state: { 
          scrollToSection: section,
          scrollOffset: offset,
          scrollBehavior: behavior
        } 
      });
    }
  }, [location.pathname, section, offset, behavior, navigate, onScrollStart, onScrollEnd]);

  return null; // This component doesn't render anything
};

export default SmartNavigation;