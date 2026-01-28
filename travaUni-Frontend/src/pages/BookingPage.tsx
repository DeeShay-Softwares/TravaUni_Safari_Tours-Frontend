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
import { colors } from '@/assets/constants/Theme';
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

// Import your step components
import DestinationSelection from './BookingServices/FindYourDestination'
import PackageSelection from './BookingServices/ChoosePackage';
import TravelerDetails from './BookingServices/TravelersDetails';
import BookingSummary from './BookingServices/viewBookingSummary';
import PaymentDetails from './BookingServices/MakeYourPayment';

const steps = [
  { label: 'Destination', icon: <FaMapMarkerAlt /> },
  { label: 'Package', icon: <FaUsers /> },
  { label: 'Traveler Info', icon: <FaUsers /> },
  { label: 'Summary', icon: <FaCheck /> },
  { label: 'Payment', icon: <FaCreditCard /> }
];

export default function BookingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  //const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleStepClick = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DestinationSelection />;
      case 1:
        return <PackageSelection />;
      case 2:
        return <TravelerDetails />;
      case 3:
        return <BookingSummary />;
      case 4:
        return <PaymentDetails />;
      default:
        return <DestinationSelection />;
    }
  };

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
        mx: 'auto'
      }}>
        {/* Hero Section */}
        <Paper 
          elevation={8} 
          sx={{
            width: '100%',
            padding: { xs: 3, sm: 4, md: 5 },
            backgroundColor: colors.bronze[100],
            textAlign: 'center',
            borderRadius: { xs: '0px', sm: '20px', md: '24px' },
            border: `2px solid ${colors.bronze[200]}`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            mx: 'auto'
          }}
        >
          {/* Decorative elements */}
          <Box sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: '50%',
            backgroundColor: colors.oliveWood[100],
            opacity: 0.4
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: '50%',
            backgroundColor: colors.wheat[200],
            opacity: 0.4
          }} />
          
          <Typography 
            variant='h1' 
            sx={{
              fontWeight: typography.heroTitle.fontWeight,
              fontSize: { 
                xs: '28px', 
                sm: '36px', 
                md: '44px', 
                lg: '52px' 
              },
              fontFamily: typography.fontFamily.primary,
              color: colors.bronze[700],
              mb: { xs: 2, sm: 3 },
              position: 'relative',
              zIndex: 1,
              lineHeight: 1.2
            }}
          >
            Book Your Safari Adventure
          </Typography>
          <Typography 
            sx={{
              fontWeight: typography.heroSubtitle.fontWeight,
              fontSize: { xs: '16px', sm: '18px', md: '20px' },
              fontFamily: typography.fontFamily.primary,
              color: colors.bronze[600],
              position: 'relative',
              zIndex: 1,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Experience the wild beauty of Africa with TravaUni Safari Tours
          </Typography>
        </Paper>

        {/* Main Content Area */}
        <Paper 
          elevation={6} 
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: { xs: '0px', sm: '20px', md: '24px' },
            overflow: 'hidden',
            border: `1px solid ${colors.darkKhakhi[200]}`,
            width: '100%',
            mx: 'auto',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
          }}
        >
          {/* Desktop Stepper */}
          {!isMobile && (
            <Box sx={{
              width: '100%',
              px: { xs: 3, sm: 4, md: 5 },
              pt: { xs: 3, sm: 4, md: 5 },
              pb: 3,
              backgroundColor: colors.wheat[50],
              borderBottom: `2px solid ${colors.bronze[100]}`
            }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel
                sx={{
                  width: '100%',
                  '& .MuiStepConnector-root': {
                    top: 18,
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: colors.darkKhakhi[300],
                    borderWidth: 2,
                  },
                  '& .MuiStepConnector-active .MuiStepConnector-line': {
                    borderColor: colors.oliveWood[500],
                  },
                  '& .MuiStepConnector-completed .MuiStepConnector-line': {
                    borderColor: colors.oliveWood[500],
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step 
                    key={step.label} 
                    completed={activeStep > index}
                    sx={{
                      cursor: activeStep > index ? 'pointer' : 'default',
                      flex: 1
                    }}
                    onClick={() => activeStep > index && handleStepClick(index)}
                  >
                    <StepLabel
                      StepIconComponent={(props) => (
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${
                              props.active 
                                ? colors.oliveWood[500] 
                                : props.completed 
                                ? colors.oliveWood[500] 
                                : colors.darkKhakhi[300]
                            }`,
                            backgroundColor: props.active 
                              ? colors.oliveWood[50] 
                              : props.completed 
                              ? colors.oliveWood[50] 
                              : 'white',
                            color: props.active 
                              ? colors.oliveWood[500] 
                              : props.completed 
                              ? colors.oliveWood[500] 
                              : colors.darkKhakhi[500],
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: activeStep > index ? 'scale(1.1)' : 'none',
                              boxShadow: activeStep > index ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                            }
                          }}
                        >
                          {props.completed ? (
                            <FaCheck size={20} />
                          ) : (
                            step.icon
                          )}
                        </Box>
                      )}
                      sx={{
                        width: '100%',
                        '& .MuiStepLabel-label': {
                          fontSize: { xs: '14px', sm: '16px', md: '17px' },
                          fontWeight: 500,
                          color: colors.darkKhakhi[700],
                          mt: 1,
                        },
                        '& .MuiStepLabel-label.Mui-active': {
                          color: colors.oliveWood[600],
                          fontWeight: 600,
                        },
                        '& .MuiStepLabel-label.Mui-completed': {
                          color: colors.oliveWood[600],
                        },
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
              width: '100%',
              px: 3,
              pt: 3,
              pb: 2,
              backgroundColor: colors.wheat[50],
              borderBottom: `2px solid ${colors.bronze[100]}`
            }}>
              <MobileStepper
                variant="dots"
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                sx={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  '& .MuiMobileStepper-dot': {
                    width: 12,
                    height: 12,
                    backgroundColor: colors.darkKhakhi[300],
                    margin: '0 4px'
                  },
                  '& .MuiMobileStepper-dotActive': {
                    backgroundColor: colors.oliveWood[500],
                    transform: 'scale(1.2)'
                  },
                }}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === steps.length - 1}
                    sx={{
                      color: colors.oliveWood[500],
                      fontWeight: 600,
                      fontSize: '15px',
                      textTransform: 'none'
                    }}
                  >
                    Next
                    <FaArrowRight style={{ marginLeft: 8 }} />
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      color: colors.darkKhakhi[600],
                      fontWeight: 600,
                      fontSize: '15px',
                      textTransform: 'none'
                    }}
                  >
                    <FaArrowLeft style={{ marginRight: 8 }} />
                    Back
                  </Button>
                }
              />
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: colors.bronze[700],
                  fontWeight: 700,
                  fontSize: '18px',
                  mt: 2,
                  mb: 1
                }}
              >
                {steps[activeStep].label}
              </Typography>
            </Box>
          )}

          {/* Step Content - Takes remaining space */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '500px', sm: '550px', md: '600px', lg: '650px' },
            overflow: 'auto',
            width: '100%'
          }}>
            <Box sx={{
              flex: 1,
              p: { xs: 3, sm: 4, md: 5 },
              width: '100%'
            }}>
              {getStepContent(activeStep)}
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{
              width: '100%',
              p: { xs: 3, sm: 4, md: 5 },
              pt: 2,
              borderTop: `1px solid ${colors.darkKhakhi[100]}`,
              backgroundColor: colors.wheat[50]
            }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%'
              }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<FaArrowLeft />}
                  sx={{
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: '12px',
                    borderColor: colors.darkKhakhi[400],
                    color: colors.darkKhakhi[700],
                    fontWeight: 600,
                    fontSize: { xs: '15px', sm: '16px', md: '17px' },
                    '&:hover': {
                      borderColor: colors.darkKhakhi[600],
                      backgroundColor: colors.darkKhakhi[50],
                      transform: 'translateY(-2px)'
                    },
                    '&.Mui-disabled': {
                      borderColor: colors.darkKhakhi[200],
                      color: colors.darkKhakhi[400],
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Back
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.darkKhakhi[600],
                      fontSize: { xs: '14px', sm: '15px', md: '16px' },
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Step {activeStep + 1} of {steps.length}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<FaArrowRight />}
                    sx={{
                      px: { xs: 4, sm: 5, md: 6 },
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: '12px',
                      backgroundColor: activeStep === steps.length - 1 
                        ? colors.oliveWood[600] 
                        : colors.bronze[500],
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '15px', sm: '16px', md: '17px' },
                      '&:hover': {
                        backgroundColor: activeStep === steps.length - 1 
                          ? colors.oliveWood[700] 
                          : colors.bronze[600],
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {activeStep === steps.length - 1 ? 'Complete Booking' : 'Continue'}
                  </Button>
                </Box>
              </Box>

              {/* Progress bar for mobile */}
              {isMobile && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{
                    width: '100%',
                    height: 6,
                    backgroundColor: colors.darkKhakhi[100],
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      width: `${((activeStep + 1) / steps.length) * 100}%`,
                      height: '100%',
                      backgroundColor: colors.oliveWood[500],
                      transition: 'width 0.4s ease-out'
                    }} />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1.5,
                      color: colors.darkKhakhi[600],
                      fontSize: '13px'
                    }}
                  >
                    <span>Step {activeStep + 1}</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Info Footer */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          mt: 2,
          px: { xs: 2, sm: 3 }
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 1.5,
            backgroundColor: colors.oliveWood[50],
            borderRadius: '16px',
            border: `2px solid ${colors.oliveWood[200]}`,
            flex: 1,
            minWidth: '200px',
            maxWidth: '300px'
          }}>
            <FaShieldAlt size={18} color={colors.oliveWood[600]} />
            <Box>
              <Typography sx={{
                color: colors.darkKhakhi[800],
                fontSize: '14px',
                fontWeight: 700
              }}>
                Secure Payment
              </Typography>
              <Typography sx={{
                color: colors.darkKhakhi[600],
                fontSize: '12px',
                mt: 0.5
              }}>
                256-bit SSL encryption
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 1.5,
            backgroundColor: colors.wheat[50],
            borderRadius: '16px',
            border: `2px solid ${colors.wheat[300]}`,
            flex: 1,
            minWidth: '200px',
            maxWidth: '300px'
          }}>
            <FaCalendarAlt size={18} color={colors.bronze[600]} />
            <Box>
              <Typography sx={{
                color: colors.darkKhakhi[800],
                fontSize: '14px',
                fontWeight: 700
              }}>
                Instant Confirmation
              </Typography>
              <Typography sx={{
                color: colors.darkKhakhi[600],
                fontSize: '12px',
                mt: 0.5
              }}>
                Within 24 hours
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 3,
            py: 1.5,
            backgroundColor: colors.bronze[50],
            borderRadius: '16px',
            border: `2px solid ${colors.bronze[200]}`,
            flex: 1,
            minWidth: '200px',
            maxWidth: '300px'
          }}>
            <FaHeadset size={18} color={colors.bronze[600]} />
            <Box>
              <Typography sx={{
                color: colors.darkKhakhi[800],
                fontSize: '14px',
                fontWeight: 700
              }}>
                24/7 Support
              </Typography>
              <Typography sx={{
                color: colors.darkKhakhi[600],
                fontSize: '12px',
                mt: 0.5
              }}>
                Always here to help
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}