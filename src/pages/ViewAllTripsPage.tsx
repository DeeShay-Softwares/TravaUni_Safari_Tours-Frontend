// src/pages/ViewAllTripsPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import TripCard from '../components/TripCard';
import TripDetailsModal from '../components/TripDetailsPanel';
import type { Trip } from '../types';
import { colors } from '../assets/constants/Theme';
import { useNavigate } from 'react-router-dom';


/**
 * ViewAllTripsPage Component - Page displaying all available trips
 * Users navigate here after clicking "View more"
 */
const ViewAllTripsPage: React.FC = () => {
  // Sample trips data
  const [trips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Bali Tour Package',
      duration: 7,
      price: 285,
      startDate: '2024-08-23',
      endDate: '2024-08-29',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Experience the beauty of Bali with our 7-day tour package.',
      location: 'Bali, Indonesia',
      reviewCount: 128,
    },
    {
      id: '2',
      title: 'Java Tour Package',
      duration: 5,
      price: 218,
      startDate: '2024-08-23',
      endDate: '2024-08-27',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Explore the cultural heart of Indonesia.',
      location: 'Java, Indonesia',
      reviewCount: 89,
    },
    {
      id: '3',
      title: 'Solo Tour Package',
      duration: 3,
      price: 163,
      startDate: '2024-08-23',
      endDate: '2024-08-25',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'A short getaway to Solo city.',
      location: 'Solo, Indonesia',
      reviewCount: 45,
    },
    {
      id: '4',
      title: 'Lombok Adventure',
      duration: 6,
      price: 320,
      startDate: '2024-09-15',
      endDate: '2024-09-21',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Explore the pristine beaches and waterfalls of Lombok.',
      location: 'Lombok, Indonesia',
      reviewCount: 67,
    },
    {
      id: '5',
      title: 'Yogyakarta Heritage',
      duration: 4,
      price: 195,
      startDate: '2024-10-01',
      endDate: '2024-10-05',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Discover ancient temples and cultural heritage.',
      location: 'Yogyakarta, Indonesia',
      reviewCount: 92,
    },
    {
      id: '6',
      title: 'Raja Ampat Diving',
      duration: 8,
      price: 450,
      startDate: '2024-11-10',
      endDate: '2024-11-18',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1569949381669-ecf31b17c6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'World-class diving in the coral triangle.',
      location: 'Raja Ampat, Indonesia',
      reviewCount: 56,
    },
    {
      id: '7',
      title: 'Komodo Island Exploration',
      duration: 5,
      price: 380,
      startDate: '2024-12-01',
      endDate: '2024-12-06',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'See the legendary Komodo dragons in their natural habitat.',
      location: 'Komodo Island, Indonesia',
      reviewCount: 78,
    },
    {
      id: '8',
      title: 'Bromo Volcano Sunrise',
      duration: 3,
      price: 175,
      startDate: '2024-09-01',
      endDate: '2024-09-04',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Witness the spectacular sunrise at Mount Bromo.',
      location: 'East Java, Indonesia',
      reviewCount: 112,
    },
  ]);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles trip card click
   */
  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  /**
   * Navigates back to home page
   */
  const handleGoBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: colors.bronze[100],
      py: { xs: 4, sm: 5, md: 6 },
      px: { xs: 2, sm: 3 },
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
        {/* Go Back Button */}
        <Button
          variant="outlined"
          onClick={handleGoBackToHome}
          sx={{ 
            height: { xs: '48px', sm: '56px' }, 
            width: { xs: '100%', sm: '300px' }, 
            mb: 4,
            borderRadius: '8px',
            borderColor: colors.darkKhakhi[300],
            color: colors.darkKhakhi[600],
            '&:hover': {
              borderColor: colors.darkKhakhi[400],
              backgroundColor: colors.darkKhakhi[50],
            }
          }}
        >
          Go back to Home
        </Button>

                  

        {/* Page Header */}
        <Box sx={{ 
          mb: { xs: 4, sm: 5, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 2, md: 4 },
          px: { xs: 2, sm: 0 }
        }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: colors.darkKhakhi[600],
              lineHeight: 1.2,
            }}
          >
            All Trips
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              color: colors.darkKhakhi[300],
              fontSize: { xs: '0.875rem', sm: '1rem' },
              lineHeight: 1.6,
            }}
          >
            Browse through our complete collection of curated travel experiences. 
            Book and secure your position for an extraordinary adventure and 
            unforgettable memories.
          </Typography>
        </Box>

        {/* Results Count */}
        <Box sx={{ mb: 3, px: { xs: 2, sm: 0 } }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.darkKhakhi[700],
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Showing <Box component="span" sx={{ fontWeight: 700 }}>{trips.length}</Box> trips
          </Typography>
        </Box>

       
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 0 }
          }}
        >
          {trips.map(trip => (
            <Box 
              key={trip.id}
              sx={{
                width: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  '& .trip-card': {
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
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

        {/* No trips message */}
        {trips.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: { xs: 2, sm: 0 }
          }}>
            <Typography variant="h6" sx={{ color: colors.darkKhakhi[400], mb: 2 }}>
              No trips available at the moment
            </Typography>
            <Typography variant="body2" sx={{ color: colors.darkKhakhi[300] }}>
              Check back soon for new travel experiences!
            </Typography>
          </Box>
        )}
      </Container>

      {/* Trip Details Modal */}
      <TripDetailsModal
        trip={selectedTrip}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </Box>
  );
};

export default ViewAllTripsPage;