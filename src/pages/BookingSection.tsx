import '../App.css';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTittle';
import { Theme } from '../assets/constants/colors';
import { typography } from '../assets/constants/typography';
import { Box, Paper, Button, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ServicesTags } from '../components/ServicesTags';
import { TravelStepsVertical } from '../components/BookingSteps';
import { BiArrowToRight, BiChevronDown } from "react-icons/bi";
import { BsDisplay } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { GlassyButton } from '../components/GlassyButton';
import { useState } from 'react';
import ContactModal from '@/components/ContactModal';
import HelpModal from '@/components/HelpModal';

export function BookingSection() {
  const muiTheme = useMuiTheme();
  const isMediumScreen = useMediaQuery(muiTheme.breakpoints.between('md', 'lg'));
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const navigate= useNavigate();
const [isContactModalOpen, setIsContactModalOpen] = useState(false);
const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const whatsappUrl = 'https://wa.me/0780264423'

 
  const handleNavClick = (action: string ) => {
    console.log(`User clicked: ${action}`);
    
    switch(action) {
      case 'book':
        
        navigate('/book',{
          replace: true
        })
        break;
      case 'trips':
       
         navigate('/viewtrips',{
          replace: true
        })
        break;
      default:
        break;
    }
  };

  return (
    <div id='services'>
      <Section 
        backgroundColor={Theme.wheat[100]} 
        padding={isMobile ? "40px 20px" : isSmallScreen ? "50px 30px" : "30px 30px"}
        sx={{
          minHeight: isMobile ? 'auto' : '100vh',
          height: 'auto',
          padding: isMobile ? 5 : 6,
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? 4 : isSmallScreen ? 5 : '20px',
          width: '100%',
        }}>
          {/* Left Side - Image Card */}
          <Paper
            elevation={12}
            sx={{
              position: "relative",
              borderRadius: "15px",
              height: isMobile ? "450px" : isSmallScreen ? "450px" : isMediumScreen ? "500px" : "720px",
              width: isMobile ? "100%" : isSmallScreen ? "90%" : isMediumScreen ? "450px" : "550px",
              maxWidth: "100%",
              overflow: "hidden",
              mx: 'auto',
              padding: isMobile ? "100px 0" : isMediumScreen ? "20px 20px" : '20px 20px'
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src="/pictures/pic4.jpeg"
              alt="pic"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))",
              }}
            />

            {/* Text Content */}
            <Box
              sx={{
                position: "absolute",
                bottom: isMobile ? 12 : 18,
                left: isMobile ? 12 : 16,
                right: isMobile ? 12 : 16,
                color: "#fff",
                zIndex: 1,
                top: isMobile? 1 : 1,
                padding: isMobile? 0: 2,
                overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
               
              }}
            >
              <ServicesTags
                subtitle='TravaUni Packages'
                title='What we offer'
              />
              
             <Box sx={{
              display: isMobile? 'none': 'block',
             mt: 5,
             ml: 14
             }}>
                <GlassyButton 
                        title="Contact"
                        highlight="Us"
                         onClick={() => setIsContactModalOpen(true)}
                        height='20px'
                        width='200px'
                      />
                      
              
             </Box>
            </Box>
          </Paper>

          {/* Right Side - How it works */}
          <Box sx={{
            width: isSmallScreen ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isSmallScreen ? 'center' : 'flex-start',
            textAlign: isSmallScreen ? 'center' : 'left',
          }}>
            <Box sx={{
              mb: isMobile ? 2 : 2,
              px: isMobile ? 2 : 0,
            }}>
              <SectionTitle
                title='How it works'
                color={Theme['olive-wood'][300]}
                fontSize={isMobile ? typography.sectionLabel.fontSize : typography.heroSubtitle.fontSize}
                fontWeight={typography.inputText.fontWeight}
              />

               <SectionTitle
              title='One click for you'
              color={Theme.bronze[500]}
              fontSize={isMobile ? typography.sectionTitle.fontSize : isSmallScreen ? typography.inputText.fontSize : typography.heroTitle.fontSize}
              fontWeight={typography.heroSubtitle.fontWeight}
            />
            </Box>
            
           
             
           

            {/* STEP NAVIGATION BAR */}
            <Box
              sx={{
                position: 'sticky',
                top: isMobile ? 56 : 64, // Adjust based on your header height
                zIndex: 10,
                backgroundColor: Theme['olive-wood'][700],
                borderRadius: '12px 12px 0 0',
                padding: isMobile ? '12px 16px' : '16px 24px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 2 : 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: isSmallScreen ? '100%' : isMediumScreen ? '500px' : '650px',
                mx: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* View Booked Trips Button */}
              <Button
                startIcon={<BsDisplay size={16} />}
                onClick={() => handleNavClick('trips')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  px: "1.0rem",
                  py: "0.5rem",
                  borderRadius: "8px",
                  border: `1px solid ${Theme.wheat[200]}`,
                  color: Theme.wheat[100],
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 600,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  minWidth: isMobile ? '100%' : 'auto',
                  flex: isMobile ? 1 : '0 0 auto',
                  "&:hover": {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View Booked Trips
              </Button>

              {/* Main Book Now Button */}
              <Button
                onClick={() => handleNavClick('book')}
                sx={{
                  backgroundColor: Theme.wheat[200],
                  color: Theme['olive-wood'][700],
                  px: "2.5rem",
                  py: "0.7rem",
                  borderRadius: "8px",
                  border: `1px solid ${Theme.bronze[300]}`,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 700,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: isMobile ? '100%' : 'auto',
                  flex: isMobile ? 1 : '0 0 auto',
                  "&:hover": {
                    backgroundColor: Theme.bronze[300],
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(186, 143, 89, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Book Now
              </Button>

              {/* Help Button */}
              <Button
                endIcon={<BiArrowToRight size={18} />}
               onClick={() => setIsHelpModalOpen(true)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  px: "1.5rem",
                  py: "0.6rem",
                  borderRadius: "8px",
                  border: `1px solid ${Theme.wheat[300]}`,
                  color: Theme.wheat[200],
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 500,
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: isMobile ? '100%' : 'auto',
                  flex: isMobile ? 1 : '0 0 auto',
                  "&:hover": {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                 
                }}
              >
                Need Help?
              </Button>
            </Box>

            {/* Steps Container with Scroll */}
            <Paper
              elevation={12}
              sx={{
                borderRadius: '0 0 20px 20px',
                position: "relative",
                height: isMobile ? "350px" : isSmallScreen ? "400px" : isMediumScreen ? "450px" : "520px",
                width: isMobile ? "100%" : isSmallScreen ? "100%" : isMediumScreen ? "500px" : "650px",
                maxWidth: "100%",
                backgroundColor: Theme['olive-wood'][600],
                overflow: "hidden",
                mx: 'auto',
                mt: 0,
              }}
            >
              {/* Instruction Text */}
              <Box
                sx={{
                  padding: isMobile ? '20px 16px 10px' : '24px 20px 12px',
                  color: Theme.wheat[100],
                  textAlign: 'center',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  fontFamily: typography.fontFamily.primary,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  borderBottom: `1px solid ${Theme['olive-wood'][500]}`,
                  lineHeight: 1.5,
                }}
              >
                <strong>Booking Guide:</strong> Click "Book Now" above, then follow these 4 simple steps to complete your reservation.
              </Box>

              {/* Scrollable Steps Content */}
              <Box
                sx={{
                  height: "calc(100% - 70px)",
                 overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
               
                }}
              >
                <TravelStepsVertical />
              </Box>

              {/* Scroll Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                  opacity: 0.6,
                  animation: "bounce 1.5s infinite",
                }}
              >
                <BiChevronDown size={isMobile ? 28 : 35} color={Theme.wheat[50]}/>
              </Box>
            </Paper>
          </Box>

          
        </Box>
        
        
         <ContactModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        whatsappUrl={whatsappUrl}
      />
      <HelpModal
        open={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        whatsappUrl="https://wa.me/0780264423" // Your WhatsApp number
        contactEmail="support@yourcompany.com" // Your support email
      />
      </Section>

      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translate(-50%, 0);
            }
            50% {
              transform: translate(-50%, 6px);
            }
          }
        `}
      </style>

     
   
    </div>
  );
}