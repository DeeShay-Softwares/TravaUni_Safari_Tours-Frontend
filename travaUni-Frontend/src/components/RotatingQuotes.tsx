import { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { Theme } from "../assets/constants/theme";
import { typography } from "../assets/constants/typography";

interface RotatingQuotesProps {
  quotes: string[];
  duration?: number; // seconds each quote stays visible
  transitionDuration?: number; // transition animation duration in ms
  autoPlay?: boolean;
  showIndicators?: boolean;
}

const RotatingQuotes = ({
  quotes,
  duration = 5, // Default 5 seconds per quote
  transitionDuration = 1000, // Default 1 second transition
  autoPlay = true,
  showIndicators = true,
}: RotatingQuotesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');

  const handleNext = useCallback(() => {
    if (quotes.length <= 1) return;
    
    setDirection('next');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  }, [quotes.length, transitionDuration]);

  useEffect(() => {
    if (!autoPlay || quotes.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [autoPlay, duration, quotes.length, handleNext]);

  const handlePrev = () => {
    if (quotes.length <= 1) return;
    
    setDirection('prev');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  };

  const handleIndicatorClick = (index: number) => {
    if (index === currentIndex) return;
    
    setDirection(index > currentIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  };

  // Animation styles
  const quoteContainerStyle = {
    position: 'relative',
    height: '150px', // Fixed height to prevent layout shift
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const quoteStyle = (index: number) => ({
    position: 'absolute' as const,
    width: '100%',
    opacity: index === currentIndex ? 1 : 0,
    transform: `translateX(${
      index === currentIndex 
        ? '0' 
        : direction === 'next' 
          ? '100%' 
          : '-100%'
    })`,
    transition: `all ${transitionDuration}ms ease-in-out`,
    pointerEvents: 'none' as const,
  });

  const indicatorStyle = (index: number) => ({
    width: index === currentIndex ? '30px' : '8px',
    height: '8px',
    backgroundColor: index === currentIndex 
      ? Theme.wheat[100] 
      : 'rgba(255, 255, 255, 0.3)',
    borderRadius: '4px',
    margin: '0 4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: Theme.wheat[200],
    },
  });

  // Navigation buttons style
  const navButtonStyle = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: Theme.wheat[100],
    zIndex: 10,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-50%) scale(1.1)',
    },
    '&:disabled': {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
  };

  if (quotes.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
      {/* Navigation Buttons */}
      {quotes.length > 1 && (
        <>
          <Box
            sx={{
              ...navButtonStyle,
              left: { xs: '10px', md: '-50px' },
            }}
            onClick={handlePrev}
          >
            ←
          </Box>
          <Box
            sx={{
              ...navButtonStyle,
              right: { xs: '10px', md: '-50px' },
            }}
            onClick={handleNext}
          >
            →
          </Box>
        </>
      )}

      {/* Quotes Container */}
      <Box sx={quoteContainerStyle}>
        {quotes.map((quote, index) => (
          <Box key={index} sx={quoteStyle(index)}>
            <Typography sx={{
              fontFamily: `'Telma', cursive`,
              fontSize: typography.bodyText.fontSize,
              fontWeight: typography.heroSubtitle.fontWeight,
              color: Theme.wheat[100],
              textAlign: 'center',
              lineHeight: 1.6,
              px: 2,
              opacity: isTransitioning && index === currentIndex ? 0.7 : 1,
              transition: `opacity ${transitionDuration / 2}ms ease`,
            }}>
              {quote}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Indicators/Dots */}
      {showIndicators && quotes.length > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3,
          gap: 1 
        }}>
          {quotes.map((_, index) => (
            <Box
              key={index}
              sx={indicatorStyle(index)}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </Box>
      )}

    </Box>
  );
};

export default RotatingQuotes;
