// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { FiHome, FiPlus, FiLogOut, FiList, FiGrid, FiEye, FiUsers } from 'react-icons/fi';
import AdminTripForm from '../components/AdminTripForm';
import AdminTripCard from '../components/AdminTripCard';
import TripDetailsModal from '../components/TripDetailsPanel';
import type { Trip, SnackbarState } from '../types';
import { colors } from '../assets/constants/Theme';
import { useNavigate } from 'react-router-dom';

/**
 * AdminPage Component - Main admin interface for managing trips
 */
const AdminPage: React.FC = () => {
  // State management
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Bali Tour Package',
      duration: 7,
      price: 285,
      startDate: '2024-08-23',
      endDate: '2024-08-29',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Experience the beauty of Bali with our 7-day tour package. Visit stunning beaches, ancient temples, and vibrant markets.',
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
      description: 'Explore the cultural heart of Indonesia. Visit ancient temples, volcanic landscapes, and traditional villages.',
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
      description: 'A short getaway to Solo city, known for its rich Javanese culture and traditional batik.',
      location: 'Solo, Indonesia',
      reviewCount: 45,
    }
  ]);

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate()

  const handleLogOut = () =>{
    navigate('/',{
      replace: true
    })
  }
  /**
   * Handles adding a new trip
   */
  const handleAddTrip = (newTrip: Trip) => {
    const tripWithId = { ...newTrip, id: Date.now().toString() };
    setTrips(prev => [tripWithId, ...prev]);
    setEditingTrip(null);
    setActiveTab(0);
    showSnackbar('Trip uploaded successfully!', 'success');
  };

  /**
   * Handles updating an existing trip
   */
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    ));
    setEditingTrip(null);
    setActiveTab(0);
    showSnackbar('Trip updated successfully!', 'success');
  };

  /**
   * Handles trip deletion
   */
  const handleDeleteTrip = (tripToDelete: Trip) => {
    if (window.confirm(`Are you sure you want to delete "${tripToDelete.title}"?\nThis action cannot be undone.`)) {
      setTrips(prev => prev.filter(trip => trip.id !== tripToDelete.id));
      showSnackbar('Trip deleted successfully!', 'info');
    }
  };

  /**
   * Handles form submission
   */
  const handleFormSubmit = (tripData: Trip) => {
    if (editingTrip) {
      handleUpdateTrip(tripData);
    } else {
      handleAddTrip(tripData);
    }
  };

  /**
   * Shows snackbar notification
   */
  const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Closes snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar((prev: any) => ({ ...prev, open: false }));
  };

  /**
   * Handles tab change
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  /**
   * Handles edit trip
   */
  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setActiveTab(1);
  };

  /**
   * Handles preview trip
   */
  const handlePreviewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  /**
   * Calculates total value of all trips
   */
  const calculateTotalValue = () => {
    return trips.reduce((total, trip) => total + trip.price, 0);
  };

  /**
   * Calculates average rating
   */
  const calculateAverageRating = () => {
    if (trips.length === 0) return 0;
    const sum = trips.reduce((total, trip) => total + trip.rating, 0);
    return sum / trips.length;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${colors.darkKhakhi[50]} 0%, ${colors.wheat[50]} 100%)`
    }}>
      {/* Admin App Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.darkKhakhi[200]}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2,
              backgroundColor: colors.oliveWood[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiHome size={24} color="white" />
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: colors.darkKhakhi[900]
              }}
            >
              Travel Admin
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button 
            variant="outlined"
            startIcon={<FiLogOut />}
            onClick={() => {
              showSnackbar('Logged out successfully!', 'info');
              handleLogOut();
            }}
            sx={{
              borderColor: colors.darkKhakhi[300],
              color: colors.darkKhakhi[700],
              '&:hover': {
                borderColor: colors.darkKhakhi[400],
                backgroundColor: colors.darkKhakhi[50]
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight={800} 
            gutterBottom
            sx={{ color: colors.darkKhakhi[900] }}
          >
            Trip Management
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.darkKhakhi[700],
              maxWidth: 600
            }}
          >
            Upload, edit, and manage your travel packages. All changes will be reflected on the main website.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.darkKhakhi[200]}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2,
                  backgroundColor: colors.oliveWood[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiList size={24} color={colors.oliveWood[600]} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={colors.darkKhakhi[900]}>
                    {trips.length}
                  </Typography>
                  <Typography variant="caption" color={colors.darkKhakhi[600]}>
                    Total Trips
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.darkKhakhi[200]}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2,
                  backgroundColor: colors.bronze[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiUsers size={24} color={colors.bronze[600]} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={colors.darkKhakhi[900]}>
                    ${calculateTotalValue().toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color={colors.darkKhakhi[600]}>
                    Total Value
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.darkKhakhi[200]}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2,
                  backgroundColor: colors.wheat[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiEye size={24} color={colors.wheat[600]} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700} color={colors.darkKhakhi[900]}>
                    {calculateAverageRating().toFixed(1)}
                  </Typography>
                  <Typography variant="caption" color={colors.darkKhakhi[600]}>
                    Avg. Rating
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs for Navigation */}
        <Paper sx={{ 
          mb: 4, 
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.darkKhakhi[200]}`
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                fontSize: '16px',
                fontWeight: 600,
              }
            }}
          >
            <Tab 
              icon={<FiGrid style={{ marginRight: 8 }} />} 
              iconPosition="start" 
              label="All Trips" 
            />
            <Tab 
              icon={<FiPlus style={{ marginRight: 8 }} />} 
              iconPosition="start" 
              label="Upload Trip" 
            />
          </Tabs>
        </Paper>

        {/* Content based on active tab */}
        {activeTab === 0 ? (
          <>
            {/* Action Bar */}
            <Paper sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${colors.darkKhakhi[200]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ color: colors.darkKhakhi[900] }}>
                  {trips.length} Trip{trips.length !== 1 ? 's' : ''}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="Grid"
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    variant={viewMode === 'grid' ? 'filled' : 'outlined'}
                    icon={<FiGrid />}
                  />
                  <Chip
                    label="List"
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    variant={viewMode === 'list' ? 'filled' : 'outlined'}
                    icon={<FiList />}
                  />
                </Box>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => {
                  setEditingTrip(null);
                  setActiveTab(1);
                }}
                sx={{
                  backgroundColor: colors.oliveWood[500],
                  '&:hover': {
                    backgroundColor: colors.oliveWood[600],
                  }
                }}
              >
                Upload New Trip
              </Button>
            </Paper>

            {/* Trips Grid */}
            {trips.length === 0 ? (
              <Paper sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colors.darkKhakhi[200]}`
              }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No trips uploaded yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Start by uploading your first tour package
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FiPlus />}
                  onClick={() => {
                    setEditingTrip(null);
                    setActiveTab(1);
                  }}
                  sx={{
                    backgroundColor: colors.oliveWood[500],
                    '&:hover': {
                      backgroundColor: colors.oliveWood[600],
                    }
                  }}
                >
                  Upload Your First Trip
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {trips.map(trip => (
                  <Grid item key={trip.id} xs={12} sm={6} md={4} lg={3}>
                    <AdminTripCard
                      trip={trip}
                      onEdit={handleEditTrip}
                      onDelete={handleDeleteTrip}
                      onPreview={handlePreviewTrip}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          /* Upload/Edit Form Tab */
          <Box>
            <Button
              variant="outlined"
              onClick={() => setActiveTab(0)}
              startIcon={<FiHome />}
              sx={{ 
                mb: 3,
                borderColor: colors.darkKhakhi[300],
                color: colors.darkKhakhi[700],
                '&:hover': {
                  borderColor: colors.darkKhakhi[400],
                  backgroundColor: colors.darkKhakhi[50]
                }
              }}
            >
              Back to All Trips
            </Button>
            
            <AdminTripForm
              trip={editingTrip}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditingTrip(null);
                setActiveTab(0);
              }}
            />
          </Box>
        )}
      </Container>

      {/* Trip Details Modal */}
      <TripDetailsModal
        trip={selectedTrip}
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;