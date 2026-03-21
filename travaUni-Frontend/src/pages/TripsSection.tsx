// src/components/TripsSection.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import TripCard from '../components/TripCard';
import TripDetailsModal from '../components/TripDetailsPanel';
import type { TripInput } from '../types';
import { useNavigate } from 'react-router-dom';
import { Section } from '../components/Section';
import { SectionTitle } from '../components/SectionTittle';
import { Theme } from '../assets/constants/colors';
import { typography } from '../assets/constants/typography';
import RotatingQuotes from '../components/RotatingQuotes';
import { GlassyButton } from '../components/GlassyButton';
import TripServices from '@/ApiCalls/TripApi';


/**
 * TripsSection Component - Displays trip cards with "View more" button
 */
const TripsSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));


   const quotes = [
    "Embark on our safari tours where relaxation and adventure awaits, creating unforgettable memories along the way",
    "Discover hidden gems and experience nature like never before with our expert guides",
    "Luxury meets wilderness in our exclusive retreats, designed for ultimate comfort in the wild",
    "Create lasting memories with family and friends in our carefully curated adventure packages",
    "Experience the thrill of the wild while enjoying world-class amenities and service"
  ];

  const [selectedTrip, setSelectedTrip] = useState<TripInput | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all trips when component mounts
  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await TripServices.getAllTrips();
      
      // response.data has: { success: true, count: 10, data: [...] }
      setTrips(response.data.data);
      console.log('Fetched trips:', response.data.count);
      
    } catch (err) {
      setError('Failed to fetch trips');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchAllTrips}>
          Try Again
        </Button>
      </Container>
    );
  }

  /**
   * Handles trip card click - opens the side panel
   */
  const handleTripClick = (trip: TripInput) => {
    setSelectedTrip(trip);
    setIsPanelOpen(true);
  };

  /**
   * Closes the side panel
   */
  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Clear selected trip after animation completes
    setTimeout(() => setSelectedTrip(null), 300);
  };

  /**
   * Handles "View more" button click
   */
  const handleViewMore = () => {
    navigate('/trips', { replace: true });
  };

  return (

<Section backgroundColor={Theme.wheat[100]} padding="60px 50px" sx={{
        height: '100vh'
       }}>

 <SectionTitle
        title='Our Available Destination'
      color={Theme['olive-wood'][300]}
      fontSize={typography.heroSubtitle.fontSize}
      fontWeight={typography.inputText.fontWeight}
        />

      <Box sx={{
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: isMobile ? 'flex-start' : isSmallScreen ? 'center' : 'flex-start',
  gap: isMobile ? 2 : isSmallScreen ? 3 : 4,
  flexWrap: 'wrap',
}}>

  {/* Title - Takes more space on larger screens */}
  <Box sx={{
    flex: isMobile ? '0 0 100%' : isSmallScreen ? '0 0 100%' : '0 0 40%',
    maxWidth: isMobile ? '100%' : isSmallScreen ? '100%' : '40%',
  }}>
    <SectionTitle
      title='Our Tours'
      color={Theme.bronze[500]}
      fontSize={
        isMobile ? typography.sectionTitle.fontSize : 
        isSmallScreen ? typography.inputText.fontSize : 
        typography.heroTitle.fontSize
      }
      fontWeight={typography.heroSubtitle.fontWeight}
      
    />
  </Box>

  {/* Description - Takes remaining space */}
  <Box sx={{
    flex: isMobile ? '0 0 100%' : isSmallScreen ? '0 0 100%' : '0 0 55%',
    maxWidth: isMobile ? '100%' : isSmallScreen ? '100%' : '55%',
    display: 'flex',
    alignItems: 'center',
  }}>
    <Box
      sx={{
        color: Theme['olive-wood'][300],
        fontSize: 
          isMobile ? typography.inputText.fontSize : 
          isSmallScreen ? typography.inputText.fontSize : 
          typography.heroSubtitle.fontSize,
        fontWeight: typography.inputText.fontWeight,
        textAlign: isMobile ? 'left' : 'left',
        width: '100%',
        lineHeight: 1.6,
      }}
    >
      {isMobile ? (
       <Typography>
        Our trip destinations and tours offer unimaginable and unforgettable memories and also great relaxation.
        Book now and secure your position
       </Typography>
      ):(
     <RotatingQuotes 
                    quotes={quotes}
                    duration={5} 
                    transitionDuration={800} 
                    autoPlay={true}
                    showIndicators={true}
                  />
      )}
      </Box>

  </Box>
</Box>




    <Box sx={{ 
      py: { xs: 4, md: 8 }, 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
      

        {/* Trips Grid Container with Slide Animation */}
        <Box
          sx={{
            transition: 'all 0.3s ease-in-out',
            transform: isPanelOpen ? 
              (isMobile ? 'translateY(-20px)' : 'translateX(-25%)') : 
              'none',
            filter: isPanelOpen ? 'brightness(0.95)' : 'none',
            position: 'relative',
            zIndex: 1,
            px: { xs: 2, sm: 0 }
          }}
        >
          {/* CSS Grid for Trip Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, sm: 3 },
              mb: { xs: 4, md: 6 },
              justifyItems: 'center'
            }}
          >
            {trips.map(trip => (
              <Box 
                key={trip.title}
                sx={{
                  width: '100%',
                  maxWidth: { xs: '400px', sm: 'none' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    '& .trip-card': {
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    }
                  }
                }}
              >
                <TripCard
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                  className="trip-card"
                />
              </Box>
            ))}
          </Box>

          {/* View More Button - also affected by slide */}
          <Box sx={{ 
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
            opacity: isPanelOpen ? 0.7 : 1,
            px: { xs: 2, sm: 0 }
          }}>

                <GlassyButton 
  title="View"
  highlight=" More"
  onClick={() => handleViewMore()}
  height='20px'
  width='200px'
  background={Theme['dark-khakhi'][900]}
/>

            {/* <Button
              variant="contained"
              endIcon={<FiArrowRight />}
              onClick={handleViewMore}
              sx={{
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '14px', md: '16px' },
                fontWeight: 600,
                borderRadius: 2,
                backgroundColor: colors.oliveWood[500],
                minWidth: { xs: '200px', md: 'auto' },
                '&:hover': {
                  backgroundColor: colors.oliveWood[600],
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View more
            </Button> */}
          </Box>
        </Box>

        {/* Background Dim Overlay */}
        {isPanelOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(2px)',
              zIndex: 1199,
              opacity: isPanelOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: isMobile ? 'auto' : 'none', // Only clickable on mobile
            }}
            onClick={isMobile ? handleClosePanel : undefined}
          />
        )}
      </Container>

      {/* Trip Details Panel */}
      <TripDetailsModal
        trip={selectedTrip}
        open={isPanelOpen}
        onClose={handleClosePanel}
      />
    </Box>
    </Section>
  );
};

export default TripsSection;