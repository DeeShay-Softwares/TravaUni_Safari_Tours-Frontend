import { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { Theme } from "../assets/constants/colors";
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

  

  // Animation styles
  const quoteContainerStyle = {
    position: 'relative',
    height: '80px', // Fixed height to prevent layout shift
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


  if (quotes.length === 0) return null;

  return (
    <Box sx={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
      

      {/* Quotes Container */}
      <Box sx={quoteContainerStyle}>
        {quotes.map((quote, index) => (
          <Box key={index} sx={quoteStyle(index)}>
            <Typography sx={{
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.bodyText.fontSize,
              fontWeight: typography.heroSubtitle.fontWeight,
              color: Theme['olive-wood'][300],
              textAlign: 'left',
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


    </Box>
  );
};

export default RotatingQuotes;
