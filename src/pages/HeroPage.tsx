import { useState } from "react";
import "../App.css";
import { Theme } from "../assets/constants/colors";
import { typography } from "../assets/constants/typography";
import { Box, Typography, Button, useTheme, useMediaQuery, Drawer, List, ListItem, ListItemText,
   Divider, IconButton } from "@mui/material";
import NavBar from "../components/NavBar";
import GroupAvatars from "../components/GroupedAvatars";
import { CgArrowLongRight } from "react-icons/cg";
import { GlassyButton } from "../components/GlassyButton";
import ImageGallery from "../components/HerominiGallery";
import ContactModal from "@/components/ContactModal";
import StickyNav from "@/components/StickyNav";
import { FiX, FiUser } from "react-icons/fi";
import Avatar from "@mui/material/Avatar";

export function HeroPage() {
  const dissolveBackgroundStyle = {
    background: 'radial-gradient(circle at right, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('de');

  const whatsappUrl = 'https://wa.me/0780264423';
  
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Trips', href: '#trips' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Book', href: '#book' },
  ];
  
  const languages = [
    { code: 'de', label: 'De' },
    { code: 'en', label: 'En' }
  ];

  const scrollToSection = (href: string) => {
    const sectionId = href.substring(1);
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    setMobileDrawerOpen(false);
  };

  const handleLanguageClose = (code?: string) => {
    if (code) {
      setSelectedLanguage(code);
    }
  };

  const mobileDrawer = (
    <Box sx={{ 
      width: 280,
      height: '100%',
      backgroundColor: Theme['olive-wood']?.[600] || 'rgba(44, 41, 32, 0.95)',
      backdropFilter: 'blur(20px)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
          <FiX size={24} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 4 }}>
        <Avatar
          alt="Logo"
          src="/public/pictures/travaUni_logo.jpeg"
          sx={{ width: 50, height: 50 }}
        />
        <Typography variant="h5" sx={{ fontWeight: 800, color: Theme.bronze?.[200] || '#c9a84c' }}>
          TravaUni
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            onClick={() => scrollToSection(item.href)}
            sx={{ 
              py: 2, 
              cursor: 'pointer', 
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } 
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{ '& .MuiTypography-root': { textAlign: 'center', fontWeight: 500 } }} 
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageClose(lang.code)}
              sx={{
                color: selectedLanguage === lang.code ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: selectedLanguage === lang.code ? 700 : 500,
                textTransform: 'uppercase',
              }}
            >
              {lang.label}
            </Button>
          ))}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<FiUser />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            py: 1.5,
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        id="home"
        className="homepagecontainer"
        sx={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* NAVBAR */}
        <NavBar
          logoText="TravaUni"
          tabBackground="rgba(247, 235, 212, 0.16)"
          tabBorderRadius={30}
          textColor="rgb(247 235 212)"
          hoverColor="#ffffff"
        />

        {/* Sticky Navbar - Appears only when scrolling */}
        <StickyNav 
          onMenuClick={() => setMobileDrawerOpen(true)}
        />

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280, 
              backgroundColor: 'transparent' 
            },
          }}
        >
          {mobileDrawer}
        </Drawer>

        {/* HERO CENTER CONTENT */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 4 },
            mb: isMobile ? 30 : 10,
            mt: { xs: 8, md: 12 },
          }}
        >
          <Box className="heroTittle">
            <Typography
              sx={{
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.heroTitle.fontWeight,
                color: Theme.wheat[100],
                lineHeight: 1.2,
                fontSize: {
                  xs: "2rem",
                  sm: "2.8rem",
                  md: typography.heroTitle.fontSize,
                  lg: typography.heroTitle.fontSize,
                },
              }}
            >
              Extraordinary{" "} <br />
              <span className="herosecondaryFont">cultural </span>and{" "}
              <span className="herosecondaryFont">natural</span> <br />charm.
            </Typography>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: '10px',
              marginTop: 2
            }}>
              <GlassyButton 
                title="Contact"
                highlight="Us"
                onClick={() => setIsContactModalOpen(true)}
                height={isMobile ? '10px' : '20px'}
                width={isMobile ? '180px' : '200px'}
                sx={{
                  position: 'relative',
                  zIndex: 1000,
                  pointerEvents: 'auto',
                }}
              />

              <Button
                endIcon={<CgArrowLongRight size={20} />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  px: isMobile ? '1rem' : "1.8rem",
                  width: isMobile ? '180px' : '200px',
                  py: isMobile ? '0.8rem' : "0.8rem",
                  borderRadius: "999px",
                  border: `1px solid ${Theme.wheat[100]}`,
                  color: Theme.wheat[100],
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  position: 'relative',
                  zIndex: 1000,
                  pointerEvents: 'auto',
                  alignSelf: { xs: "flex-start", md: "center" },
                  "&:hover": {
                    backgroundColor: Theme.bronze[500],
                    color: Theme.bronze[100]
                  },
                }}
              >
                Check it out...
              </Button>     
            </Box>
          </Box>
        </Box>

        {/* BOTTOM HERO FOOTER */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "16px", md: "32px" },
            left: 0,
            right: 0,
            px: { xs: 2, md: 4 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* LEFT CONTENT */}
          <Box
            sx={{
              width: { xs: "100%", md: "26rem" },
              textAlign: "left",
              height: isMobile ? '0' : '5px'
            }}
          >
            <Box sx={{ marginLeft: 5 }}>
              <Typography
                component={'span'}
                sx={{
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.sectionTitle.fontSize,
                  fontWeight: typography.sectionLabel.fontWeight,
                  color: Theme.wheat[100],
                }}
              >
                15{''}
                <Typography
                  component={'span'}
                  sx={{
                    fontFamily: typography.fontFamily.primary,
                    fontSize: typography.statNumber.fontSize,
                    fontWeight: typography.inputText.fontWeight
                  }}
                >
                  +
                </Typography>
              </Typography>
            </Box>
            <GroupAvatars />
            <Typography
              sx={{
                mt: 1.5,
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.bodyText.fontWeight,
                color: Theme.wheat[200],
                fontSize: '12px',
                lineHeight: 1.6,
                borderRadius: 2,
                ...dissolveBackgroundStyle
              }}
            >
              At Travauni, we craft affordable yet exclusive travel experiences
              designed around you. From curated getaways to fully customized trips,
            </Typography>
          </Box>

          <Box>
            <ImageGallery />   
          </Box>    
        </Box>
        
        <ContactModal
          open={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          whatsappUrl={whatsappUrl}
        />
      </Box>
    </>
  );
}