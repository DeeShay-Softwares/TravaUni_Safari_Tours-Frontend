'use client';

import React, { useState, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Theme } from "../assets/constants/colors";
import { typography } from "../assets/constants/typography";
import {
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineCreditCard,
  HiOutlineEye,
} from "react-icons/hi";
import CustomModal from "./Modal";
import { useNavigate } from "react-router-dom";

// ── Lazy-load the actual page components ──────────────────────────────────────

const DestinationPage  = lazy(() => import("../pages/BookingServices/FindYourDestination"));
const PackagePage      = lazy(() => import("../pages/BookingServices/ChoosePackage"));
const PaymentPage      = lazy(() => import("../pages/BookingServices/MakeYourPayment"));
const SummaryPage      = lazy(() => import("../pages/BookingServices/viewBookingSummary"));

// ── Loading fallback ──────────────────────────────────────────────────────────

const LoadingFallback = ({ stepTitle }: { stepTitle: string }) => (
  <Box sx={{
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "400px", flexDirection: "column", gap: 2,
  }}>
    <CircularProgress size={60} thickness={4} sx={{ color: Theme["olive-wood"][500] }} />
    <Typography sx={{ color: Theme["olive-wood"][600], mt: 2 }}>
      Loading {stepTitle}...
    </Typography>
  </Box>
);

// ── Default-prop wrappers ─────────────────────────────────────────────────────
// Each step component requires props from the booking flow.
// These wrappers supply safe defaults so the previews render without errors
// when opened from TravelStepsVertical outside the full BookingPage flow.

function DestinationPreview() {
  return <DestinationPage onDestinationSelect={() => {}} selectedDestination={null} />;
}

function PackagePreview() {
  return (
    <PackagePage
      selectedDestination={null}
      onPackageSelect={() => {}}
      selectedPackage={null}
    />
  );
}

function PaymentPreview() {
  return (
    <PaymentPage
      bookingData={{
        destination: null,
        selectedPackage: null,
        travelerInfo: null,
        totalPrice: 0,
      }}
      onPaymentComplete={() => {}}
    />
  );
}

function SummaryPreview() {
  return (
    <SummaryPage
      bookingData={{
        destination: null,
        selectedPackage: null,
        travelerInfo: null,
        totalPrice: 0,
      }}
      onEdit={() => {}}
    />
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export const TravelStepsVertical = ({
  activeStep = 0,
  onStepClick,
  routes = [],
}: TravelStepsProps) => {
  const [activeIndex, setActiveIndex]         = useState(activeStep);
  const [modalOpen, setModalOpen]             = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const navigate  = useNavigate();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down("md"));

  // ── Step config ─────────────────────────────────────────────────────────────

  const stepRoutes = [
    routes[0] ?? "/booking/find-destination",
    routes[1] ?? "/booking/book-ticket",
    routes[2] ?? "/booking/payment",
    routes[3] ?? "/booking/view-destination",
  ];

  // Each entry pairs a modal preview component with metadata
  const stepConfig: { title: string; Preview: React.FC }[] = [
    { title: "Find Your Destination", Preview: DestinationPreview },
    { title: "Book Your Ticket",      Preview: PackagePreview },
    { title: "Make Payment",          Preview: PaymentPreview },
    { title: "View Destination Details", Preview: SummaryPreview },
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

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStepClick = (index: number) => {
    setActiveIndex(index);
    setCurrentStepIndex(index);
    onStepClick?.(index);

    if (isMobile && steps[index].route) {
      navigate(steps[index].route as string);
    } else if (!isMobile) {
      setModalOpen(true);
    }
  };

  const { title: modalTitle, Preview: CurrentPreview } = stepConfig[currentStepIndex];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Box sx={{
        display: "flex", flexDirection: "column", gap: 3,
        maxWidth: "800px", margin: "0 auto", padding: "30px",
      }}>
        {steps.map((step, index) => (
          <Box
            key={index}
            onClick={() => handleStepClick(index)}
            sx={{
              display: "flex", alignItems: "flex-start", gap: 3,
              cursor: "pointer", padding: "22px", borderRadius: "18px",
              background: activeIndex === index ? Theme["olive-wood"][300] : "transparent",
              border: activeIndex === index
                ? "1px solid rgba(255,255,255,0.25)"
                : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
                transform: isMobile ? "scale(1.02)" : "translateX(6px)",
              },
            }}
          >
            {/* Icon */}
            <Box sx={{
              minWidth: 52, height: 52, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: activeIndex === index
                ? Theme["olive-wood"][500]
                : "rgba(255,255,255,0.12)",
              color: activeIndex === index ? Theme["olive-wood"][200] : Theme.wheat[100],
              fontSize: "1.6rem",
            }}>
              {step.icon}
            </Box>

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{
                fontFamily: typography.fontFamily.primary,
                fontWeight: 600, fontSize: "1.25rem",
                color: activeIndex === index
                  ? Theme["olive-wood"][700]
                  : "rgba(255,255,255,0.85)",
                mb: 1,
              }}>
                {step.title}
              </Typography>
              <Typography sx={{
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.inputText.fontSize,
                color: activeIndex === index
                  ? Theme["olive-wood"][600]
                  : "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
              }}>
                {step.description}
              </Typography>
            </Box>

            {/* Arrow indicator */}
            <Box sx={{
              fontSize: "1.5rem", color: Theme["olive-wood"][700],
              opacity: activeIndex === index ? 1 : 0,
            }}>
              {isMobile ? "↗" : "→"}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modal — desktop only */}
      {!isMobile && (
        <CustomModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalTitle}
          size="lg"
          fullScreenControl={true}
          padding={0}
          keepMounted={true}
        >
          <Suspense fallback={<LoadingFallback stepTitle={modalTitle} />}>
            <CurrentPreview />
          </Suspense>
        </CustomModal>
      )}
    </>
  );
};