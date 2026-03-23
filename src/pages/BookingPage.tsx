import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  MobileStepper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { colors } from '@/assets/constants/theme';
import { typography } from '@/assets/constants/typography';
import { 
  FaCalendarAlt, 
  FaCreditCard, 
  FaUsers, 
  FaMapMarkerAlt,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaHeadset
} from 'react-icons/fa';

import DestinationSelection from './BookingServices/FindYourDestination';
import PackageSelection from './BookingServices/ChoosePackage';
import TravelerDetails from './BookingServices/TravelersDetails';
import BookingSummary from './BookingServices/viewBookingSummary';
import PaymentDetails from './BookingServices/MakeYourPayment';

// ── Import the real types from the child components ──────────────────────────
import type { PackageOption } from './BookingServices/ChoosePackage';
import type { TravelerInfo } from './BookingServices/TravelersDetails';
import type { TripInput } from '@/types';

// ── BookingData now uses the real child-component types ───────────────────────
interface BookingData {
  destination: TripInput | null;
  selectedPackage: PackageOption | null;
  travelerInfo: TravelerInfo | null;       // ✅ matches TravelerDetails output
  totalPrice: number;
  bookingReference?: string;
}

const steps = [
  { label: 'Destination',  icon: <FaMapMarkerAlt /> },
  { label: 'Package',      icon: <FaUsers /> },
  { label: 'Traveler Info',icon: <FaUsers /> },
  { label: 'Summary',      icon: <FaCheck /> },
  { label: 'Payment',      icon: <FaCreditCard /> },
];

export default function BookingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({
    destination: null,
    selectedPackage: null,
    travelerInfo: null,
    totalPrice: 0,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ── Navigation ──────────────────────────────────────────────────────────────

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleStepClick = (step: number) => {
    if (step < activeStep) setActiveStep(step);
  };

  // ── Data handlers ───────────────────────────────────────────────────────────

  const handleDestinationSelect = (destination: TripInput) => {
    setBookingData(prev => ({
      ...prev,
      destination,
      totalPrice: destination?.price ?? 0,
    }));
  };

  const handlePackageSelect = (selectedPackage: PackageOption | null) => {
    setBookingData(prev => ({
      ...prev,
      selectedPackage,
      totalPrice: selectedPackage?.totalPrice ?? prev.destination?.price ?? 0,
    }));
  };

  // ✅ Accepts the real TravelerInfo shape from TravelerDetails
  const handleTravelerInfoSubmit = (travelerInfo: TravelerInfo) => {
    setBookingData(prev => ({ ...prev, travelerInfo }));
  };

  const handleBookingComplete = async (paymentDetails?: unknown) => {
    console.log('Booking completed:', bookingData, paymentDetails);
    try {
      // const response = await BookingAPI.createBooking({ ... });
      // setBookingData(prev => ({ ...prev, bookingReference: response.data.bookingReference }));
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  };

  // ── Step validation ─────────────────────────────────────────────────────────

  const canProceed = (): boolean => {
    switch (activeStep) {
      case 0:
        return bookingData.destination !== null;

      case 1:
        return bookingData.selectedPackage !== null;

      case 2: {
        const info = bookingData.travelerInfo;
        if (!info) return false;
        // ✅ Validate against the real TravelerInfo shape
        const mainOk =
          Boolean(info.mainTraveler?.fullName) &&
          Boolean(info.mainTraveler?.age) &&
          Boolean(info.mainTraveler?.gender) &&
          Boolean(info.mainTraveler?.idNumber);
        const contactOk =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email) &&
          info.phone.length >= 10;
        const addlOk = info.additionalTravelers.every(
          t => t.fullName && t.age && t.gender && t.idNumber
        );
        return mainOk && contactOk && addlOk;
      }

      case 3:
        return true; // Summary is review-only

      case 4:
        return true; // PaymentDetails handles its own validation

      default:
        return false;
    }
  };

  // ── Step content ────────────────────────────────────────────────────────────

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <DestinationSelection
            onDestinationSelect={handleDestinationSelect}
            selectedDestination={bookingData.destination}
          />
        );
      case 1:
        return (
          <PackageSelection
            selectedDestination={bookingData.destination}
            onPackageSelect={handlePackageSelect}
            selectedPackage={bookingData.selectedPackage}
          />
        );
      case 2:
        return (
          <TravelerDetails
            onTravelerInfoSubmit={handleTravelerInfoSubmit}
            initialData={bookingData.travelerInfo}
          />
        );
      case 3:
        return (
          <BookingSummary
            bookingData={bookingData}
            onEdit={(stepNumber: number) => setActiveStep(stepNumber)}
          />
        );
      case 4:
        return (
          <PaymentDetails
            bookingData={bookingData}
            onPaymentComplete={handleBookingComplete}
          />
        );
      default:
        return <DestinationSelection onDestinationSelect={handleDestinationSelect} />;
    }
  };

  const handleNextClick = () => {
    if (!canProceed()) return;
    if (activeStep < steps.length - 1) handleNext();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '98.8vw',
      backgroundColor: colors.bronze[50],
      py: { xs: 0, sm: 2, md: 3 },
      px: { xs: 0, sm: 1 },
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
    }}>
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
      }}>
        {/* Hero */}
        <Paper elevation={8} sx={{
          width: '100%',
          padding: { xs: 3, sm: 4, md: 5 },
          backgroundColor: colors.bronze[100],
          textAlign: 'center',
          borderRadius: { xs: '0px', sm: '20px', md: '24px' },
          border: `2px solid ${colors.bronze[200]}`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        }}>
          <Box sx={{
            position: 'absolute', top: -60, right: -60,
            width: 240, height: 240, borderRadius: '50%',
            backgroundColor: colors.oliveWood[100], opacity: 0.4,
          }} />
          <Box sx={{
            position: 'absolute', bottom: -40, left: -40,
            width: 180, height: 180, borderRadius: '50%',
            backgroundColor: colors.wheat[200], opacity: 0.4,
          }} />
          <Typography variant="h1" sx={{
            fontWeight: typography.heroTitle.fontWeight,
            fontSize: { xs: '28px', sm: '36px', md: '44px', lg: '52px' },
            fontFamily: typography.fontFamily.primary,
            color: colors.bronze[700],
            mb: { xs: 2, sm: 3 },
            position: 'relative', zIndex: 1, lineHeight: 1.2,
          }}>
            Book Your Safari Adventure
          </Typography>
          <Typography sx={{
            fontWeight: typography.heroSubtitle.fontWeight,
            fontSize: { xs: '16px', sm: '18px', md: '20px' },
            fontFamily: typography.fontFamily.primary,
            color: colors.bronze[600],
            position: 'relative', zIndex: 1,
            maxWidth: '800px', mx: 'auto', lineHeight: 1.6,
          }}>
            Experience the wild beauty of Africa with TravaUni Safari Tours
          </Typography>
        </Paper>

        {/* Main Content */}
        <Paper elevation={6} sx={{
          flex: 1, display: 'flex', flexDirection: 'column',
          backgroundColor: 'white',
          borderRadius: { xs: '0px', sm: '20px', md: '24px' },
          overflow: 'hidden',
          border: `1px solid ${colors.darkKhakhi[200]}`,
          width: '100%', mx: 'auto',
          boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
        }}>
          {/* Desktop Stepper */}
          {!isMobile && (
            <Box sx={{
              width: '100%',
              px: { xs: 3, sm: 4, md: 5 },
              pt: { xs: 3, sm: 4, md: 5 },
              pb: 3,
              backgroundColor: colors.wheat[50],
              borderBottom: `2px solid ${colors.bronze[100]}`,
            }}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{
                width: '100%',
                '& .MuiStepConnector-root': { top: 18 },
                '& .MuiStepConnector-line': { borderColor: colors.darkKhakhi[300], borderWidth: 2 },
                '& .MuiStepConnector-active .MuiStepConnector-line': { borderColor: colors.oliveWood[500] },
                '& .MuiStepConnector-completed .MuiStepConnector-line': { borderColor: colors.oliveWood[500] },
              }}>
                {steps.map((step, index) => (
                  <Step
                    key={step.label}
                    completed={activeStep > index}
                    sx={{ cursor: activeStep > index ? 'pointer' : 'default', flex: 1 }}
                    onClick={() => handleStepClick(index)}
                  >
                    <StepLabel
                      StepIconComponent={(props) => (
                        <Box sx={{
                          width: 44, height: 44, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: `2px solid ${props.active || props.completed ? colors.oliveWood[500] : colors.darkKhakhi[300]}`,
                          backgroundColor: props.active || props.completed ? colors.oliveWood[50] : 'white',
                          color: props.active || props.completed ? colors.oliveWood[500] : colors.darkKhakhi[500],
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: activeStep > index ? 'scale(1.1)' : 'none',
                            boxShadow: activeStep > index ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                          },
                        }}>
                          {props.completed ? <FaCheck size={20} /> : step.icon}
                        </Box>
                      )}
                      sx={{
                        width: '100%',
                        '& .MuiStepLabel-label': { fontSize: { xs: '14px', sm: '16px', md: '17px' }, fontWeight: 500, color: colors.darkKhakhi[700], mt: 1 },
                        '& .MuiStepLabel-label.Mui-active': { color: colors.oliveWood[600], fontWeight: 600 },
                        '& .MuiStepLabel-label.Mui-completed': { color: colors.oliveWood[600] },
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {/* Mobile Stepper */}
          {isMobile && (
            <Box sx={{
              width: '100%', px: 3, pt: 3, pb: 2,
              backgroundColor: colors.wheat[50],
              borderBottom: `2px solid ${colors.bronze[100]}`,
            }}>
              <MobileStepper
                variant="dots"
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                sx={{
                  width: '100%', backgroundColor: 'transparent',
                  '& .MuiMobileStepper-dot': { width: 12, height: 12, backgroundColor: colors.darkKhakhi[300], margin: '0 4px' },
                  '& .MuiMobileStepper-dotActive': { backgroundColor: colors.oliveWood[500], transform: 'scale(1.2)' },
                }}
                nextButton={
                  <Button size="small" onClick={handleNextClick} disabled={activeStep === steps.length - 1 || !canProceed()} sx={{ color: colors.oliveWood[500], fontWeight: 600, fontSize: '15px', textTransform: 'none' }}>
                    Next <FaArrowRight style={{ marginLeft: 8 }} />
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0} sx={{ color: colors.darkKhakhi[600], fontWeight: 600, fontSize: '15px', textTransform: 'none' }}>
                    <FaArrowLeft style={{ marginRight: 8 }} /> Back
                  </Button>
                }
              />
              <Typography variant="h6" sx={{ textAlign: 'center', color: colors.bronze[700], fontWeight: 700, fontSize: '18px', mt: 2, mb: 1 }}>
                {steps[activeStep].label}
              </Typography>
            </Box>
          )}

          {/* Step Content */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: { xs: '500px', sm: '550px', md: '600px', lg: '650px' }, overflow: 'auto', width: '100%' }}>
            <Box sx={{ flex: 1, p: { xs: 3, sm: 4, md: 5 }, width: '100%' }}>
              {getStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ width: '100%', p: { xs: 3, sm: 4, md: 5 }, pt: 2, borderTop: `1px solid ${colors.darkKhakhi[100]}`, backgroundColor: colors.wheat[50] }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<FaArrowLeft />}
                  sx={{
                    px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1.5, sm: 2 },
                    borderRadius: '12px', borderColor: colors.darkKhakhi[400],
                    color: colors.darkKhakhi[700], fontWeight: 600,
                    fontSize: { xs: '15px', sm: '16px', md: '17px' },
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: colors.darkKhakhi[600], backgroundColor: colors.darkKhakhi[50], transform: 'translateY(-2px)' },
                    '&.Mui-disabled': { borderColor: colors.darkKhakhi[200], color: colors.darkKhakhi[400] },
                  }}
                >
                  Back
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.darkKhakhi[600], fontSize: { xs: '14px', sm: '15px', md: '16px' }, fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                    Step {activeStep + 1} of {steps.length}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={handleNextClick}
                    endIcon={<FaArrowRight />}
                    disabled={!canProceed()}
                    sx={{
                      px: { xs: 4, sm: 5, md: 6 }, py: { xs: 1.5, sm: 2 },
                      borderRadius: '12px',
                      backgroundColor: activeStep === steps.length - 1 ? colors.oliveWood[600] : colors.bronze[500],
                      color: 'white', fontWeight: 700,
                      fontSize: { xs: '15px', sm: '16px', md: '17px' },
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: activeStep === steps.length - 1 ? colors.oliveWood[700] : colors.bronze[600],
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      },
                      '&.Mui-disabled': { backgroundColor: colors.darkKhakhi[300], transform: 'none' },
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Complete Booking' : 'Continue'}
                  </Button>
                </Box>
              </Box>

              {/* Mobile progress bar */}
              {isMobile && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ width: '100%', height: 6, backgroundColor: colors.darkKhakhi[100], borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ width: `${((activeStep + 1) / steps.length) * 100}%`, height: '100%', backgroundColor: colors.oliveWood[500], transition: 'width 0.4s ease-out' }} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, color: colors.darkKhakhi[600], fontSize: '13px' }}>
                    <span>Step {activeStep + 1}</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Info Footer */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2, px: { xs: 2, sm: 3 } }}>
          {[
            { icon: <FaShieldAlt size={18} color={colors.oliveWood[600]} />, bg: colors.oliveWood[50], border: colors.oliveWood[200], title: 'Secure Payment', sub: '256-bit SSL encryption' },
            { icon: <FaCalendarAlt size={18} color={colors.bronze[600]} />, bg: colors.wheat[50], border: colors.wheat[300], title: 'Instant Confirmation', sub: 'Within 24 hours' },
            { icon: <FaHeadset size={18} color={colors.bronze[600]} />, bg: colors.bronze[50], border: colors.bronze[200], title: '24/7 Support', sub: 'Always here to help' },
          ].map(({ icon, bg, border, title, sub }) => (
            <Box key={title} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 1.5, backgroundColor: bg, borderRadius: '16px', border: `2px solid ${border}`, flex: 1, minWidth: '200px', maxWidth: '300px' }}>
              {icon}
              <Box>
                <Typography sx={{ color: colors.darkKhakhi[800], fontSize: '14px', fontWeight: 700 }}>{title}</Typography>
                <Typography sx={{ color: colors.darkKhakhi[600], fontSize: '12px', mt: 0.5 }}>{sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}