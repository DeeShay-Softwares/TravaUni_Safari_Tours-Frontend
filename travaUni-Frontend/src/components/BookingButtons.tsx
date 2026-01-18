'use client';

import React, { useState, lazy, Suspense} from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery,
  CircularProgress
} from "@mui/material";
import { Theme } from "../assets/constants/theme";
import { typography } from "../assets/constants/typography";

import {
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineEye,
} from "react-icons/hi";

import CustomModal from "./Modal";
import { useNavigate } from "react-router-dom";


// Lazy load page components
const DestinationPage = lazy(() => import("../pages/BookingServices/FindYourDestination"));
const BookingPage = lazy(() => import("../pages/BookingServices/BookYourTicket"));
const PaymentPage = lazy(() => import("../pages/BookingServices/MakeYourPayment"));
const ViewDestinationPage = lazy(() => import("../pages/BookingServices/ViewDestination"));

// Loading spinner component
const LoadingFallback = ({ stepTitle }: { stepTitle: string }) => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '400px',
    flexDirection: 'column',
    gap: 2
  }}>
    <CircularProgress 
      size={60} 
      thickness={4}
      sx={{ color: Theme["olive-wood"][500] }} 
    />
    <Typography sx={{ color: Theme["olive-wood"][600], mt: 2 }}>
      Loading {stepTitle}...
    </Typography>
  </Box>
);

interface TravelStep {
  title: string;
  description: string;
  icon: React.ReactElement;
  route?: string;
}

interface TravelStepsProps {
  activeStep?: number;
  onStepClick?: (index: number) => void;
  routes?: string[];
}

export const TravelStepsVertical = ({
  activeStep = 0,
  onStepClick,
  routes = [],
}: TravelStepsProps) => {
  const [activeIndex, setActiveIndex] = useState(activeStep);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  
  // Check if we're on mobile
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Array of lazy components
  const stepComponents = [
    DestinationPage,
    BookingPage,
    PaymentPage,
    ViewDestinationPage,
  ];
  
  // Step titles
  const stepTitles = [
    "Find Your Destination",
    "Book Your Ticket",
    "Make Payment",
    "View Destination Details"
  ];

  const stepRoutes = [
    routes[0] || "/booking/find-destination",
    routes[1] || "/booking/book-ticket",
    routes[2] || "/booking/payment",
    routes[3] || "/booking/view-destination",
  ];
   
  const steps: TravelStep[] = [
    {
      title: "Find your destination",
      description: "Browse our curated trips or create a custom journey...",
      icon: <HiOutlineLocationMarker />,
      route: stepRoutes[0],
    },
    {
      title: "Book a ticket",
      description: "Secure your place with a simple and seamless booking process...",
      icon: <HiOutlineTicket />,
      route: stepRoutes[1],
    },
    {
      title: "Make payment",
      description: "Complete your booking using secure and flexible payment options...",
      icon: <HiOutlineCreditCard />,
      route: stepRoutes[2],
    },
    {
      title: "View destination",
      description: "Access your trip details, updates, and important information...",
      icon: <HiOutlineEye />,
      route: stepRoutes[3],
    },
  ];

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    setCurrentStepIndex(index);
    


    if (isMobile && steps[index].route) {
        navigate(steps[index].route as string);
      // Mobile: Open new tab
      window.open(steps[index].route, '_blank');
    } else if (!isMobile) {
      // Desktop: Open modal
      setModalOpen(true);
    }
    
    onStepClick?.(index);
  };


  const handleCloseModal = () => {
    setModalOpen(false);
  };


  // Get the lazy component for the current step
  const CurrentStepPage = stepComponents[currentStepIndex];
  const currentModalTitle = stepTitles[currentStepIndex];

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

      {/* MODAL with Suspense for lazy loading */}
      {!isMobile && (
        <CustomModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={currentModalTitle}
          size="lg"
          fullScreenControl={true}
          padding={0}
          keepMounted={true} 
        >
          <Suspense fallback={<LoadingFallback stepTitle={currentModalTitle} />}>
            <CurrentStepPage />
          </Suspense>
        </CustomModal>
      )}
    </>
  );
};