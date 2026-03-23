'use client';

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery,
} from "@mui/material";
import { Theme } from "../assets/constants/colors";
import { typography } from "../assets/constants/typography";

import {
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineEye,
} from "react-icons/hi";



// Loading spinner component



interface TravelStep {
  title: string;
  description: string;
  icon: React.ReactElement;
  route?: string;
}


interface TravelStepsProps {
  activeStep?: number;
  onStepClick?: (index: number) => void;
}

export const TravelStepsVertical = ({activeStep = 0, onStepClick}: TravelStepsProps) => {
  

  
  
  
  
  

  
   
  const steps: TravelStep[] = [
    {
      title: "Find your destination",
      description: "Browse our curated trips or create a custom journey...",
      icon: <HiOutlineLocationMarker />,
     
    },
    {
      title: "Book a ticket",
      description: "Secure your place with a simple and seamless booking process...",
      icon: <HiOutlineTicket />,
    
    },
    {
      title: "Make payment",
      description: "Complete your booking using secure and flexible payment options...",
      icon: <HiOutlineCreditCard />,
     
    },
    {
      title: "View destination",
      description: "Access your trip details, updates, and important information...",
      icon: <HiOutlineEye />,
     
    },
  ];

    const [activeIndex, setActiveIndex] = useState(activeStep);


    // Check if we're on mobile
      const theme = useTheme();
      const isMobile = useMediaQuery(theme.breakpoints.down('md'));

      const handleStepClick = (index: number) => {
    setActiveIndex(index);
     onStepClick?.(index);
      }

  return (
    <>
      {/* Your steps UI remains the same */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "800px", margin: "0 auto", padding: "30px" }}>
        {steps.map((step, index) => (
           
          <Box 
            key={index}
           onClick={() => handleStepClick(index)}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 3,
              cursor: "pointer",
              padding: "22px",
              borderRadius: "18px",
              background: activeIndex === index ? Theme["olive-wood"][300] : "transparent",
              border: activeIndex === index ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.3s ease",
              "&:hover": { 
                background: "rgba(255,255,255,0.08)", 
                transform: isMobile ? "scale(1.02)" : "translateX(6px)" 
              },
            }}
          >
            {/* Icon, Text, Arrow - same as before */}
            <Box sx={{ 
              minWidth: 52, 
              height: 52, 
              borderRadius: "50%", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: activeIndex === index ? Theme["olive-wood"][500] : "rgba(255,255,255,0.12)",
              color: activeIndex === index ? Theme["olive-wood"][200] : Theme.wheat[100],
              fontSize: "1.6rem",
            }}>
              {step.icon}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ 
                fontFamily: typography.fontFamily.primary, 
                fontWeight: 600, 
                fontSize: "1.25rem",
                color: activeIndex === index ? Theme["olive-wood"][700] : "rgba(255,255,255,0.85)", 
                mb: 1 
              }}>
                {step.title}
              </Typography>
              <Typography sx={{ 
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.inputText.fontSize,
                color: activeIndex === index ? Theme["olive-wood"][600] : "rgba(255,255,255,0.65)",
                lineHeight: 1.6 
              }}>
                {step.description}
              </Typography>
            </Box>

            <Box sx={{ 
              fontSize: "1.5rem", 
              color: Theme["olive-wood"][700], 
              opacity: activeIndex === index ? 1 : 0,
            }}>
              {isMobile ? "↗" : "→"}
            </Box>
          </Box>
        ))}
      </Box>

      
    </>
  );
};