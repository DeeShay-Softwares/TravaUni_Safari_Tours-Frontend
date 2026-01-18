import '../App.css';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTittle';
import { Theme } from '../assets/constants/theme';
import { typography } from '../assets/constants/typography';
import { Box, Paper, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ServicesTags } from '../components/ServicesTags';
import RotatingQuotes from '../components/RotatingQuotes';
import { TravelStepsVertical } from '../components/BookingButtons';
import { BiChevronDown } from "react-icons/bi";



export function BookingSection() {
  const muiTheme = useMuiTheme();
  const isMediumScreen = useMediaQuery(muiTheme.breakpoints.between('md', 'lg'));
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const quotes = [
    "Embark on our safari tours where relaxation and adventure awaits, creating unforgettable memories along the way",
    "Discover hidden gems and experience nature like never before with our expert guides",
    "Luxury meets wilderness in our exclusive retreats, designed for ultimate comfort in the wild",
    "Create lasting memories with family and friends in our carefully curated adventure packages",
    "Experience the thrill of the wild while enjoying world-class amenities and service"
  ];

  return (
    <>
      <Section 
        backgroundColor={Theme.wheat[100]} 
        padding={isMobile ? "40px 20px" : isSmallScreen ? "50px 30px" : "60px 60px"}
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
              height: isMobile ? "400px" : isSmallScreen ? "450px" : isMediumScreen ? "500px" : "600px",
              width: isMobile ? "100%" : isSmallScreen ? "90%" : isMediumScreen ? "450px" : "500px",
              maxWidth: "100%",
              overflow: "hidden",
              mx: 'auto',
              padding:isMobile ? "100px 0" : isMediumScreen ? "20px 20px" : '20px 20px'
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
                bottom: isMobile ? 12 : 16,
                left: isMobile ? 12 : 16,
                right: isMobile ? 12 : 16,
                color: "#fff",
                zIndex: 1,
              }}
            >
              <ServicesTags
                subtitle='TravaUni Packages'
                title='What we offer'
              />
              
              <RotatingQuotes 
                quotes={quotes}
                duration={5} 
                transitionDuration={800} 
                autoPlay={true}
                showIndicators={true}
              />
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
              mb: isMobile ? 4 : 3,
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

            <Paper
              elevation={12}
              sx={{
                borderRadius: 5,
                position: "relative",
                height: isMobile ? "350px" : isSmallScreen ? "400px" : isMediumScreen ? "450px" : "530px",
                width: isMobile ? "100%" : isSmallScreen ? "100%" : isMediumScreen ? "500px" : "600px",
                maxWidth: "100%",
                backgroundColor: Theme['olive-wood'][600],
                overflow: "hidden",
                mx: 'auto',
              }}
            >
              <Box
                sx={{
                  height: "100%",
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
            </Paper>
          </Box>
        </Box>
      </Section>
    </>
  );
}