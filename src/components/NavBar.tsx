import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  Menu,
  MenuItem,
  Paper
} from '@mui/material';
import { FiMenu, FiX, FiGlobe, FiUser } from 'react-icons/fi';
import { typography } from '../assets/constants/typography';
import { Theme } from '../assets/constants/colors';
import Avatar from '@mui/material/Avatar';
import AdminLoginModal from '../pages/AdminLoginModal';

interface NavItem {
  label: string;
  href: string;
}

interface LanguageOption {
  code: string;
  label: string;
}

interface TransparentNavProps {
  logoText?: string;
  navItems?: NavItem[];
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  tabBackground?: string;
  tabBorderRadius?: number;
  textColor?: string;
  hoverColor?: string;
  languages?: LanguageOption[];
}

const NavBar: React.FC<TransparentNavProps> = ({
  logoText = 'TravaUni Safari Tours',
  navItems = [
    { label: 'About', href: '#services' },
    { label: 'Services', href: '#services' },
    { label: 'Tour', href: '#tours' },
    { label: 'Gallery', href: '#gallery' },
  ],
  position = 'static',
  tabBackground = 'rgba(255, 255, 255, 0.15)', // Glass effect
  tabBorderRadius = 30, // Rounded corners
  textColor = '#ffffff',
  hoverColor = '#ffffff',
  languages = [
    { code: 'de', label: 'De' },
    { code: 'en', label: 'En' }
  ]
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('de');
   const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = (code?: string) => {
    if (code) {
      setSelectedLanguage(code);
    }
    setLanguageAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ 
      width: 300,
      height: '100%',
      backgroundColor: Theme['olive-wood'][600],
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Close button at top right */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        p: 2 
      }}>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: 'white',
          }}
        >
          <FiX size={24} />
        </IconButton>
      </Box>

      {/* Logo in drawer */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 4 
      }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: Theme.bronze[200],
            letterSpacing: 1,
          }}
        >
          <Avatar
        alt="Logo"
        src="/public/pictures/travaUni_logo.jpeg"
       sx={{ width: 40, height: 40 , marginLeft: 5}}
      />
          {logoText}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

      {/* Navigation items */}
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label} 
            component="a" 
            href={item.href}
            onClick={handleDrawerToggle}
            sx={{
              py: 2,
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  textAlign: 'center',
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Language and Login in drawer */}
      <Box sx={{ 
        p: 3,
        mt: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => handleLanguageClose(lang.code)}
              sx={{
                color: selectedLanguage === lang.code ? hoverColor : 'rgba(255, 255, 255, 0.7)',
                fontWeight: selectedLanguage === lang.code ? 700 : 500,
                textTransform: 'uppercase',
                minWidth: 'auto',
                fontSize: '1rem',
                '&:hover': {
                  color: hoverColor,
                }
              }}
            >
              {lang.label}
            </Button>
          ))}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<FiUser />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            py: 1.5,
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: hoverColor,
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
      <AppBar
        position={position}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          padding: '16px 0',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 'auto',
            padding: '0 !important',
          }}>

            

            {/* Logo on the left */}
            <Typography
              variant="h4"
              component="a"
              href="/"
              sx={{
               fontWeight: typography.sectionTitle.fontWeight,
                textDecoration: 'none',
                color: Theme.wheat[200],
                letterSpacing: 1,
                fontSize: { xs: '1.8rem', md: '2.0rem'},
                flexShrink: 0,
                mr: { md: 4 },
                display: 'flex',
                justifyContent: 'space-evenly'
              }}
            >
              <Avatar
        alt="Logo"
        src="/public/pictures/travaUni_logo.jpeg"
       sx={{ width: 50, height: 50 , bottom: 5 }}
      />
              {logoText}
            </Typography>

            {/* Center Navigation Tab */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: '8px 24px',
                  backgroundColor: tabBackground,
                  backdropFilter: 'blur(10px)',
                  borderRadius: tabBorderRadius,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    href={item.href}
                    sx={{
                      color: textColor,
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      px: 2,
                      py: 0.5,
                      minWidth: 'auto',
                      textTransform: 'none',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: '1px',
                        backgroundColor: hoverColor,
                        transition: 'width 0.2s ease',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&::after': {
                          width: '60%',
                        }
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Paper>
            </Box>

            {/* Right side - Language & Login */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
              ml: 'auto',
            }}>
              {/* Language Selector */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FiGlobe style={{ color: textColor, opacity: 0.8, fontSize: '1rem' }} />
                {languages.map((lang, index) => (
                  <React.Fragment key={lang.code}>
                    <Button
                      onClick={handleLanguageClick}
                      sx={{
                        color: selectedLanguage === lang.code ? hoverColor : textColor,
                        fontWeight: selectedLanguage === lang.code ? 700 : 500,
                        textTransform: 'uppercase',
                        minWidth: 'auto',
                        fontSize: '0.95rem',
                        p: 0.5,
                        opacity: selectedLanguage === lang.code ? 1 : 0.8,
                        '&:hover': {
                          backgroundColor: 'transparent',
                          color: hoverColor,
                        }
                      }}
                    >
                      {lang.label}
                    </Button>
                    {index < languages.length - 1 && (
                      <Box sx={{ color: 'rgba(255, 255, 255, 0.3)', mx: 0.5 }}>|</Box>
                    )}
                  </React.Fragment>
                ))}
              </Box>
              
              {/* <Divider orientation="vertical" flexItem sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.3)', 
                height: 20,
                mx: 1 
              }} /> */}
              
              {/* Login Button */}
              <Button
                variant="outlined"
                onClick={() => setOpen(true)}
                startIcon={<FiUser />}
                sx={{
                  borderRadius: 20,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 2.5,
                  py: 0.75,
                  fontSize: '0.95rem',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
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
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' },
                color: textColor,
                ml: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <FiMenu size={24} />
            </IconButton>
          </Toolbar>

          {/* Mobile Navigation Tab - Below logo */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            mt: 2,
          }}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: '6px 16px',
                backgroundColor: tabBackground,
                backdropFilter: 'blur(10px)',
                borderRadius: tabBorderRadius,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                overflowX: 'auto',
                maxWidth: '100%',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {navItems.slice(0, 3).map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  sx={{
                    color: textColor,
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    px: 1.5,
                    py: 0.5,
                    minWidth: 'auto',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Paper>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 300,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchorEl}
        open={Boolean(languageAnchorEl)}
        onClose={() => handleLanguageClose()}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            mt: 1,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageClose(lang.code)}
            selected={selectedLanguage === lang.code}
            sx={{
              fontWeight: selectedLanguage === lang.code ? 700 : 500,
              py: 1.5,
              px: 3,
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
      <AdminLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default NavBar;
