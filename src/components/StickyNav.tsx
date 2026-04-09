import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
} from '@mui/material';
import { FiMenu, FiGlobe, FiUser } from 'react-icons/fi';
import { typography } from '../assets/constants/typography';
import { Theme } from '../assets/constants/colors';
import Avatar from '@mui/material/Avatar';
import AdminLoginModal from '../pages/AdminLoginModal';

interface StickyNavProps {
  logoText?: string;
  navItems?: Array<{ label: string; href: string }>;
  languages?: Array<{ code: string; label: string }>;
  textColor?: string;
  hoverColor?: string;
  onMenuClick?: () => void;
  onLoginClick?: () => void;
}

const StickyNav: React.FC<StickyNavProps> = ({
  logoText = 'TravaUni',
  navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Trips', href: '#trips' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Book', href: '#services' },
  ],
  languages = [
    { code: 'de', label: 'De' },
    { code: 'en', label: 'En' }
  ],
  textColor = 'rgb(247 235 212)',
  hoverColor = '#ffffff',
  onMenuClick,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('de');
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle scroll to show/hide sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (href: string) => {
    const sectionId = href.substring(1);
    const element = document.getElementById(sectionId);
    
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLanguageClose = (code?: string) => {
    if (code) {
      setSelectedLanguage(code);
    }
  };

  if (!visible) return null;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          zIndex: 1200,
          backgroundColor: Theme['olive-wood']?.[800] || 'rgba(44, 41, 32, 0.95)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
          borderBottom: `1px solid ${Theme.wheat?.[100] || 'rgba(247, 235, 212, 0.2)'}`,
          padding: '8px 0',
          transition: 'all 0.3s ease',
          animation: 'slideDown 0.3s ease',
          borderRadius: 0,
          '@keyframes slideDown': {
            from: {
              transform: 'translateY(-100%)',
              opacity: 0,
            },
            to: {
              transform: 'translateY(0)',
              opacity: 1,
            },
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 'auto',
            padding: '0 !important',
          }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component="a"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              sx={{
                fontWeight: typography.sectionTitle?.fontWeight || 700,
                textDecoration: 'none',
                color: Theme.wheat?.[200] || '#f5deb3',
                letterSpacing: 1,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
              }}
            >
              <Avatar
                alt="Logo"
                src="/public/pictures/travaUni_logo.jpeg"
                sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
              />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {logoText}
              </Box>
            </Typography>

            {/* Navigation Items */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              gap: 2,
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    color: textColor,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    px: 2,
                    py: 0.5,
                    minWidth: 'auto',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: hoverColor,
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right side - Language & Login */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}>
              {/* Language Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FiGlobe style={{ color: textColor, opacity: 0.8, fontSize: '0.9rem' }} />
                {languages.map((lang, index) => (
                  <React.Fragment key={lang.code}>
                    <Button
                      onClick={() => handleLanguageClose(lang.code)}
                      sx={{
                        color: selectedLanguage === lang.code ? hoverColor : textColor,
                        fontWeight: selectedLanguage === lang.code ? 700 : 500,
                        textTransform: 'uppercase',
                        minWidth: 'auto',
                        fontSize: '0.85rem',
                        p: 0.5,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: hoverColor,
                        }
                      }}
                    >
                      {lang.label}
                    </Button>
                    {index < languages.length - 1 && (
                      <Box sx={{ color: 'rgba(247, 235, 212, 0.3)', mx: 0.5 }}>|</Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              
              {/* Login Button */}
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<FiUser />}
                sx={{
                  borderRadius: 20,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.85rem',
                  borderColor: 'rgba(247, 235, 212, 0.3)',
                  color: textColor,
                  '&:hover': {
                    borderColor: hoverColor,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Login
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={onMenuClick}
              sx={{ 
                display: { md: 'none' },
                color: textColor,
                backgroundColor: 'rgba(247, 235, 212, 0.1)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  backgroundColor: 'rgba(247, 235, 212, 0.2)',
                }
              }}
            >
              <FiMenu size={24} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <AdminLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default StickyNav;