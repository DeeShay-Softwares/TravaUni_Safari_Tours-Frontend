// src/components/TripDetailsPanel.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import type { TripDetailsModalProps } from '../types';
import { colors } from '../assets/constants/Theme';

/**
 * TripDetailsPanel Component - Displays detailed information about a trip in a side panel
 */
const TripDetailsPanel: React.FC<TripDetailsModalProps> = ({ trip, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  /**
   * Panel style with glass effect
   */
  const panelStyle = {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    height: '100vh',
    width: { xs: '100%', md: '50%' },
    maxWidth: 800,
    overflow: 'auto',
    background: colors.oliveWood[100],
    backdropFilter: 'blur(20px)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.15)',
    zIndex: 1300,
    p: 0,
    transform: 'translateX(0)',
    transition: 'transform 0.3s ease-in-out',
    maxHeight: 'calc(100vh - 0)',
    overflowY: "auto",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    scrollbarWidth: "none",
  };

  /**
   * Overlay style
   */
  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(3px)',
    zIndex: 1299,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease-in-out',
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!trip) return null;

  return (
    <>
      {/* Overlay - Click to close on mobile */}
      <Box 
        sx={overlayStyle} 
        onClick={isMobile ? onClose : undefined}
      />

      {/* Main Panel */}
      <Slide 
        direction={isMobile ? 'up' : 'left'} 
        in={open} 
        mountOnEnter 
        unmountOnExit
      >
        <Paper sx={panelStyle}>
          {/* Panel Header with Close Button */}
          <Box sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: colors.oliveWood[100],
            backdropFilter: 'blur(10px)',
            zIndex: 1,
          }}>
            <Box>
              <Typography variant="h4" component="h2" fontWeight={700}>
                {trip.title}
              </Typography>
              <Chip
                label={`${trip.duration} Days`}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }}
            >
              <FiX />
            </IconButton>
          </Box>

          {/* Panel Content */}
          <Box sx={{ p: 3 }}>
            {/* Main Image */}
            <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={trip.image}
                alt={trip.title}
                style={{
                  width: '100%',
                  height: isMobile ? '200px' : '250px',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Trip Information Grid - CSS Grid */}
            <Box sx={{
              //display: 'grid',
             // gridTemplateColumns: isMobile ? '1fr' : 'repeat(12, 1fr)',
             // gap: 3,
            }}>
              {/* Left Column - Trip Details */}
              <Box sx={{
                //gridColumn: isMobile ? '1 / -1' : '1 / 9', // 8 columns on desktop
              }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  About This Trip
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  {trip.description}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AiFillStar style={{ color: colors.wheat[500], fontSize: 20, marginRight: 4 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                    {trip.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({trip.reviewCount} reviews)
                  </Typography>
                </Box>
              </Box>

              {/* Right Column - Booking Information */}
              <Box sx={{
               // gridColumn: isMobile ? '1 / -1' : '9 / -1', // 4 columns on desktop
              }}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: colors.darkKhakhi[50],
                  borderRadius: 2,
                  border: `1px solid ${colors.darkKhakhi[200]}`,
                  position: isMobile ? undefined : 'sticky',
                  top: 100
                }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Trip Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  {/* Price */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography color="text.secondary">Price per person</Typography>
                    <Typography variant="h5" fontWeight={700} color={colors.oliveWood[600]}>
                      ${trip.price}
                    </Typography>
                  </Box>

                  {/* Dates */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FiCalendar style={{ marginRight: 12, color: colors.darkKhakhi[600] }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Travel Dates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Duration */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ mr: 2 }}>
                      Duration:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trip.duration} days
                    </Typography>
                  </Box>

                  {/* Location */}
                  {trip.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FiMapPin style={{ marginRight: 12, color: colors.darkKhakhi[600] }} />
                      <Typography variant="body2" color="text.secondary">
                        {trip.location}
                      </Typography>
                    </Box>
                  )}

                  {/* Book Now Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: 2, 
                      py: 1.5,
                      backgroundColor: colors.oliveWood[500],
                      '&:hover': {
                        backgroundColor: colors.oliveWood[600],
                      }
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default TripDetailsPanel;