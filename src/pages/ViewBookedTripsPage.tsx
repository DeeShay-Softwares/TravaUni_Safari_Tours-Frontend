// src/pages/BookedTripsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Grid,
  
} from '@mui/material';
import {
  FiCalendar,
  FiUsers,
  FiKey,
  FiDollarSign,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiMessageSquare,
  FiArrowLeft,
  FiClock
} from 'react-icons/fi';
import { FaWhatsapp} from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';
import BookingVerificationModal from '../components/ViewBookingVerificationModal'
import type { BookedTrip } from '../types';

// Sample data - In real app, this comes from your API
const SAMPLE_BOOKED_TRIPS: BookedTrip[] = [
  {
    id: '1',
    bookingId: 'TRAVA-2024-00123',
    userId: '0780264423',
    tripId: 'bali-001',
    tripTitle: 'Bali Cultural Experience',
    tripImage: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    travelers: 2,
    totalPrice: 570,
    status: 'confirmed',
    bookingDate: '2024-01-20',
    whatsappGroupLink: 'https://chat.whatsapp.com/yourgroupid123',
    updates: [
      {
        id: '1',
        date: '2024-02-01',
        title: 'Tour Guide Assigned',
        description: 'Your guide for the Bali trip has been confirmed. Meet Pak Wayan!',
        important: true
      },
      {
        id: '2',
        date: '2024-02-10',
        title: 'Itinerary Updated',
        description: 'We\'ve added a special temple ceremony to your itinerary.',
        important: false
      },
      {
        id: '3',
        date: '2024-02-15',
        title: 'Important Reminder',
        description: 'Please ensure you have your passport ready. Check-in opens 2 hours before departure.',
        important: true
      }
    ]
  },
  {
    id: '2',
    bookingId: 'TRAVA-2024-00124',
    userId: '0780264423',
    tripId: 'java-001',
    tripTitle: 'Java Heritage Tour',
    tripImage: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa',
    startDate: '2024-04-10',
    endDate: '2024-04-15',
    travelers: 3,
    totalPrice: 654,
    status: 'pending',
    bookingDate: '2024-01-25',
    updates: [
      {
        id: '1',
        date: '2024-02-05',
        title: 'Payment Received',
        description: 'Your deposit has been confirmed. Final payment due March 10.',
        important: true
      }
    ]
  }
];

const ViewBookedTripsPage: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return localStorage.getItem('travauni_booking_verified') === 'true';
  });
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(() => {
    const savedVerification = localStorage.getItem('travauni_booking_verified');
    const savedTrips = localStorage.getItem('travauni_booked_trips');
    const savedPhone = localStorage.getItem('travauni_user_phone');
    return !(savedVerification === 'true' && savedTrips && savedPhone);
  });
  const [bookedTrips, setBookedTrips] = useState<BookedTrip[]>(() => {
    const savedTrips = localStorage.getItem('travauni_booked_trips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('travauni_user_phone') || '';
  });
  const [activeTrip, setActiveTrip] = useState<string | null>(null);

  const handleVerificationSuccess = (bookingId: string, phoneNumber: string) => {
    // In real app, fetch trips from API using bookingId & phoneNumber
    // For now, we'll filter sample data
    const userTrips = SAMPLE_BOOKED_TRIPS.filter(
      trip => trip.userId === phoneNumber
    );

    setBookedTrips(userTrips);
    setUserPhone(phoneNumber);
    setIsVerified(true);
    setShowVerificationModal(false);

    // Save to localStorage (simulate session)
    localStorage.setItem('travauni_booking_verified', 'true');
    localStorage.setItem('travauni_booked_trips', JSON.stringify(userTrips));
    localStorage.setItem('travauni_user_phone', phoneNumber);
  };

  const handleLogout = () => {
    setIsVerified(false);
    setBookedTrips([]);
    localStorage.removeItem('travauni_booking_verified');
    localStorage.removeItem('travauni_booked_trips');
    localStorage.removeItem('travauni_user_phone');
    setShowVerificationModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: BookedTrip['status']) => {
    switch (status) {
      case 'confirmed': return colors.oliveWood[500];
      case 'pending': return colors.bronze[500];
      case 'cancelled': return 'error.main';
      case 'completed': return 'success.main';
      default: return 'text.secondary';
    }
  };

  const handleTripClick = (tripId: string) => {
    setActiveTrip(activeTrip === tripId ? null : tripId);
  };

  if (!isVerified) {
    return (
      <BookingVerificationModal
        open={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.wheat[50], py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700} color={colors.oliveWood[700]}>
                Your Booked Trips
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Updates and information for your upcoming adventures
              </Typography>
            </Box>
            <Button
              startIcon={<FiArrowLeft />}
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{ color: colors.oliveWood[600] }}
            >
              View Another Booking
            </Button>
          </Box>
          
          <Alert 
            severity="info" 
            icon={<FaWhatsapp />}
            sx={{ 
              bgcolor: colors.oliveWood[50],
              border: `1px solid ${colors.oliveWood[200]}`,
              borderRadius: 2
            }}
          >
            <Typography fontWeight={600}>
              For real-time updates & detailed discussions, join your trip's WhatsApp group!
            </Typography>
          </Alert>
        </Paper>

        {/* Booked Trips List */}
        {bookedTrips.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <FiInfo size={48} color={colors.oliveWood[400]} style={{ marginBottom: 16 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No trips found for your account
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please check your booking ID and phone number, or contact us
            </Typography>
            <Button
              variant="contained"
              startIcon={<FaWhatsapp />}
              onClick={() => window.open('https://wa.me/0780264423', '_blank')}
              sx={{
                mt: 2,
                backgroundColor: colors.oliveWood[500],
                '&:hover': { backgroundColor: colors.oliveWood[600] }
              }}
            >
              Contact Support
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {bookedTrips.map((trip) => (
              <Paper key={trip.id} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Trip Header */}
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: colors.oliveWood[50],
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': { bgcolor: colors.oliveWood[100] }
                  }}
                  onClick={() => handleTripClick(trip.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <CardMedia
                      component="img"
                      image={trip.tripImage}
                      alt={trip.tripTitle}
                      sx={{ width: 80, height: 80, borderRadius: 2 }}
                    />
                    <Box>
                      <Typography variant="h5" fontWeight={600}>
                        {trip.tripTitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={trip.status.toUpperCase()}
                          size="small"
                          sx={{ 
                            bgcolor: getStatusColor(trip.status),
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          icon={<FiCalendar />}
                          label={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<FiUsers />}
                          label={`${trip.travelers} traveler${trip.travelers > 1 ? 's' : ''}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                  <FiChevronDown 
                    size={24} 
                    style={{ 
                      transform: activeTrip === trip.id ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.3s'
                    }} 
                  />
                </Box>

                {/* Trip Details (Collapsible) */}
                {activeTrip === trip.id && (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Left Column - Trip Info */}
                      <Grid item xs={12} md={8}>
                        {/* Booking Info */}
                        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                            Booking Information
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <FiKey color={colors.oliveWood[500]} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Booking ID" 
                                secondary={trip.bookingId}
                                secondaryTypographyProps={{ fontWeight: 600 }}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <FiCalendar color={colors.oliveWood[500]} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Booking Date" 
                                secondary={formatDate(trip.bookingDate)}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <FiDollarSign color={colors.oliveWood[500]} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Total Price" 
                                secondary={`$${trip.totalPrice}`}
                                secondaryTypographyProps={{ fontWeight: 600, color: colors.oliveWood[600] }}
                              />
                            </ListItem>
                          </List>
                        </Paper>

                        {/* Updates Section */}
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                            Latest Updates
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Important information about your trip
                          </Typography>
                          
                          {trip.updates.length === 0 ? (
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                              No updates yet. Check back closer to your trip date.
                            </Alert>
                          ) : (
                            <Box sx={{ mt: 2 }}>
                              {trip.updates.map((update: any) => (
                                <Card key={update.id} sx={{ mb: 2, borderRadius: 2, borderLeft: `4px solid ${update.important ? colors.oliveWood[500] : colors.wheat[500]}` }}>
                                  <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                      {update.important ? (
                                        <FiAlertCircle color={colors.oliveWood[500]} />
                                      ) : (
                                        <FiInfo color={colors.wheat[500]} />
                                      )}
                                      <Typography variant="subtitle1" fontWeight={600}>
                                        {update.title}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                        {formatDate(update.date)}
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {update.description}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              ))}
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* Right Column - Actions & WhatsApp */}
                      <Grid item xs={12} md={4}>
                        {/* WhatsApp Group Card */}
                        <Paper sx={{ 
                          p: 3, 
                          mb: 3, 
                          borderRadius: 2,
                          bgcolor: colors.wheat[50],
                          border: `1px solid ${colors.wheat[200]}`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <FaWhatsapp size={24} color="#25D366" />
                            <Typography variant="h6" fontWeight={600}>
                              Trip WhatsApp Group
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Join the dedicated WhatsApp group for your trip to:
                          </Typography>
                          <List dense sx={{ mb: 2 }}>
                            <ListItem>
                              <ListItemIcon><FiCheckCircle color={colors.oliveWood[500]} /></ListItemIcon>
                              <ListItemText primary="Get real-time updates" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><FiCheckCircle color={colors.oliveWood[500]} /></ListItemIcon>
                              <ListItemText primary="Connect with fellow travelers" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><FiCheckCircle color={colors.oliveWood[500]} /></ListItemIcon>
                              <ListItemText primary="Ask questions directly" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><FiCheckCircle color={colors.oliveWood[500]} /></ListItemIcon>
                              <ListItemText primary="Receive important announcements" />
                            </ListItem>
                          </List>
                          
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<FaWhatsapp />}
                            onClick={() => window.open(trip.whatsappGroupLink || 'https://wa.me/0780264423', '_blank')}
                            sx={{
                              py: 1.5,
                              borderRadius: 2,
                              backgroundColor: '#25D366',
                              '&:hover': { backgroundColor: '#128C7E' }
                            }}
                          >
                            Join WhatsApp Group
                          </Button>
                          
                          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                            <Typography variant="body2">
                              <strong>Note:</strong> For detailed itinerary, documents, and refined trip details, check the WhatsApp group regularly.
                            </Typography>
                          </Alert>
                        </Paper>

                        {/* Quick Actions */}
                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                            Quick Actions
                          </Typography>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FiMessageSquare />}
                            onClick={() => window.open('https://wa.me/0780264423', '_blank')}
                            sx={{ mb: 1, justifyContent: 'flex-start' }}
                          >
                            Contact Support
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<FiClock />}
                            sx={{ justifyContent: 'flex-start' }}
                          >
                            View Itinerary
                          </Button>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        )}

        {/* Bottom WhatsApp CTA */}
        <Paper sx={{ 
          mt: 4, 
          p: 4, 
          textAlign: 'center', 
          borderRadius: 3,
          bgcolor: colors.oliveWood[50],
          border: `2px solid ${colors.oliveWood[200]}`
        }}>
          <FaWhatsapp size={48} color="#25D366" style={{ marginBottom: 16 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom color={colors.oliveWood[700]}>
            Need More Details?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            For personalized assistance, detailed itinerary discussions, document submissions, and any other queries, 
            please join your trip's WhatsApp group or contact our support team directly.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<FaWhatsapp />}
            onClick={() => window.open('https://wa.me/0780264423', '_blank')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: '#25D366',
              '&:hover': { backgroundColor: '#128C7E' }
            }}
          >
            Open WhatsApp Support
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ViewBookedTripsPage;