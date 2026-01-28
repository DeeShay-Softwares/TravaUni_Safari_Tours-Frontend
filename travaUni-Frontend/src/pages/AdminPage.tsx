// src/pages/AdminDashboard.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Alert,
  Snackbar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar
} from '@mui/material';
import {
  FiHome,
  FiPlus,
  FiLogOut,
  FiList,
  FiGrid,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiBell,
  FiDownload,
  FiMail,
  FiDollarSign,
  FiChevronDown,
  FiMenu,
  FiTrendingUp,
  FiPackage
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import AdminTripForm from '../components/AdminTripForm';
import AdminTripCard from '../components/AdminTripCard';
import TripDetailsPanel from '../components/TripDetailsPanel';
import UpdateUploadForm from '../components/UpdateUploadForm';
import RegistrationsTable from '../components/RegistrationsTable';
import RegistrationDetailsModal from '../components/RegistrationDetailsModal';
import type { Trip, TripUpdate, Registration, SnackbarState } from '../types';
import { colors } from '../assets/constants/Theme';
import { useNavigate } from 'react-router-dom';
import AdminInstructionsPaper from './AdminInfoPage';

/**
 * AdminDashboard Component - Complete admin interface for managing trips, updates, and registrations
 */
const AdminDashboard: React.FC = () => {
  // State management
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      title: 'Bali Cultural Experience',
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
      title: 'Java Heritage Tour',
      duration: 5,
      price: 218,
      startDate: '2024-04-10',
      endDate: '2024-04-15',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'Explore the cultural heart of Indonesia. Visit ancient temples, volcanic landscapes, and traditional villages.',
      location: 'Java, Indonesia',
      reviewCount: 89,
    },
    {
      id: '3',
      title: 'Solo City Getaway',
      duration: 3,
      price: 163,
      startDate: '2024-06-15',
      endDate: '2024-06-18',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      description: 'A short getaway to Solo city, known for its rich Javanese culture and traditional batik.',
      location: 'Solo, Indonesia',
      reviewCount: 45,
    }
  ]);

  const [tripUpdates, setTripUpdates] = useState<TripUpdate[]>([
    {
      id: '1',
      tripId: '1',
      title: 'Tour Guide Assigned',
      content: 'Your guide for the Bali trip has been confirmed. Meet Pak Wayan!',
      date: '2024-02-01',
      important: true,
      sentTo: 'both'
    },
  ]);

  const [registrations, setRegistrations] = useState<Registration[]>([
    {
      id: '1',
      bookingId: 'TRAVA-2024-00123',
      tripId: '1',
      tripTitle: 'Bali Cultural Experience',
      status: 'pending',
      paymentStatus: 'paid',
      paymentProof: 'https://example.com/proof1.jpg',
      paymentAmount: 285,
      registrationDate: '2024-01-20',
      fullName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '0780264423',
      age: 25,
      gender: 'male',
      nationality: 'Rwandan',
      isStudent: true,
      university: 'University of Rwanda',
      studentId: 'UR12345',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '0780123456',
        relationship: 'Sister'
      },
      medicalConditions: 'None',
      dietaryRestrictions: 'Vegetarian',
      whatsappNumber: '0780264423',
      preferredContact: 'whatsapp',
      confirmationEmailSent: false,
      whatsappGroupAdded: false
    },
  ]);

  // UI States
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [showRegistrationDetails, setShowRegistrationDetails] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation tabs
  const tabs = [
    { id: 0, label: 'Dashboard', icon: <FiHome /> },
    { id: 1, label: 'Trips', icon: <FiPackage /> },
    { id: 2, label: 'Updates', icon: <FiMessageSquare /> },
    { id: 3, label: 'Registrations', icon: <FiUsers /> },
    //{ id: 4, label: 'Analytics', icon: <FiTrendingUp /> }
  ];

  // Statistics
  const stats = {
    totalTrips: trips.length,
    totalRegistrations: registrations.length,
    pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
    totalRevenue: registrations.filter(r => r.paymentStatus === 'paid').reduce((sum, r) => sum + r.paymentAmount, 0),
    upcomingTrips: trips.filter(t => new Date(t.startDate) > new Date()).length
  };

  /**
   * Handlers for trips
   */
  const handleAddTrip = (newTrip: Trip) => {
    setTrips(prev => [{ 
      ...newTrip, 
      id: Date.now().toString(),
      reviewCount: newTrip.reviewCount || 0,
      rating: newTrip.rating || 4.9
    }, ...prev]);
    setEditingTrip(null);
    showSnackbar('Trip uploaded successfully!', 'success');
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(prev => prev.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
    ));
    setEditingTrip(null);
    showSnackbar('Trip updated successfully!', 'success');
  };

  const handleDeleteTrip = (tripToDelete: Trip) => {
    if (window.confirm(`Are you sure you want to delete "${tripToDelete.title}"?`)) {
      setTrips(prev => prev.filter(trip => trip.id !== tripToDelete.id));
      showSnackbar('Trip deleted successfully!', 'info');
    }
  };

  const handleFormSubmit = (tripData: Trip) => {
    if (editingTrip) {
      handleUpdateTrip(tripData);
    } else {
      handleAddTrip(tripData);
    }
  };

  /**
   * Handlers for trip updates
   */
  const handleAddUpdate = (update: Omit<TripUpdate, 'id' | 'date'>) => {
    setTripUpdates(prev => [
      {
        ...update,
        id: Date.now().toString(),
        date: new Date().toISOString()
      },
      ...prev
    ]);
    showSnackbar('Update published successfully!', 'success');
    
    if (update.sentTo === 'email' || update.sentTo === 'both') {
      setTimeout(() => {
        showSnackbar('Email notifications sent to participants', 'info');
      }, 1000);
    }
  };

  /**
   * Handlers for registrations
   */
  const handleConfirmRegistration = (registrationId: string) => {
    setRegistrations(prev => prev.map(reg => {
      if (reg.id === registrationId) {
        const updated = {
          ...reg,
          status: 'confirmed' as const,
          confirmedBy: 'Admin',
          confirmedAt: new Date().toISOString(),
          confirmationEmailSent: true
        };
        
        setTimeout(() => {
          showSnackbar(`Confirmation email sent to ${reg.fullName}`, 'success');
        }, 500);
        
        return updated;
      }
      return reg;
    }));
  };

  const handleViewRegistrationDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowRegistrationDetails(true);
  };

  /**
   * handler for adding or registering admins
   * */
  const registerAdminsHandler = () =>{
    navigate('/regAdmin',{
      replace: true
    })
  }

  /**
   * UI Helpers
   */
  const showSnackbar = (message: string, severity: SnackbarState['severity']) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleExportData = () => {
  //   showSnackbar('Data exported successfully!', 'success');
  //   handleMenuClose();
  // };

  
  const renderTripsGrid = () => {
    if (editingTrip) {
      return (
        <Box>
          <Button
            variant="outlined"
            onClick={() => setEditingTrip(null)}
            startIcon={<FiHome />}
            sx={{ mb: 3 }}
          >
            Back to Trips
          </Button>
          <AdminTripForm
            trip={editingTrip}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingTrip(null)}
          />
        </Box>
      );
    }

    return (
      <>
        {/* Header with Upload Trip Button */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2 
          }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Trip Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload, edit, and manage travel packages
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* <Button
                variant="outlined"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                startIcon={viewMode === 'grid' ? <FiList /> : <FiGrid />}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button> */}
             
              <Button
                variant="contained"
                startIcon={<FiPlus />}
                onClick={() => {
                  setEditingTrip({
                    id: '',
                    title: '',
                    duration: 0,
                    price: 0,
                    startDate: '',
                    endDate: '',
                    rating: 4.9,
                    image: '',
                    description: '',
                    location: '',
                    reviewCount: 0
                  });
                }}
                sx={{ bgcolor: colors.oliveWood[500] }}
              >
                Upload Trip
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* CSS Grid Container */}
        {trips.length === 0 ? (
          <Paper sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
                setEditingTrip({
                  id: '',
                  title: '',
                  duration: 0,
                  price: 0,
                  startDate: '',
                  endDate: '',
                  rating: 4.9,
                  image: '',
                  description: '',
                  location: '',
                  reviewCount: 0
                });
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
          <Box sx={{
            
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3,
            width: '100%'
          }}>
            {trips.map(trip => (
              <Box key={trip.id}>
                <AdminTripCard
                  trip={trip}
                  onEdit={(t) => {
                    setEditingTrip(t);
                  }}
                  onDelete={handleDeleteTrip}
                  onPreview={(t) => {
                    setSelectedTrip(t);
                    setShowTripDetails(true);
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 0: // Dashboard
        return (
          <Box>
            {/* Stats Cards */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3,
              mb: 4
            }}>
              {[
                { label: 'Total Trips', value: stats.totalTrips, color: colors.oliveWood[500], icon: <FiPackage /> },
                { label: 'Registrations', value: stats.totalRegistrations, color: colors.bronze[500], icon: <FiUsers /> },
                { label: 'Pending', value: stats.pendingRegistrations, color: colors.wheat[500], icon: <FiBell /> },
                { label: 'Revenue', value: `$${stats.totalRevenue}`, color: '#25D366', icon: <FiDollarSign /> }
              ].map((stat, index) => (
                <Paper key={index} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 2,
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {React.cloneElement(stat.icon, { size: 24, color: stat.color })}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Quick Actions */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(1, 1fr)'
              },
              gap: 3
            }}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns:{
                    xs: 'repeat(1, 1fr)',
                    md: 'repeat(3, 1fr)'
                  } ,
                  gap: 2
                }}>
                  {[
                    { label: 'Upload New Trip', icon: <FiPlus />, onClick: () => setActiveTab(1) },
                    { label: 'Send Update', icon: <FiMessageSquare />, onClick: () => setActiveTab(2) },
                    { label: 'View Registrations', icon: <FiUsers />, onClick: () => setActiveTab(3) },
                    //{ label: 'Export Data', icon: <FiDownload />, onClick: handleExportData }
                  ].map((action, index) => (
                    <Button
                      key={index}
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.onClick}
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: 2
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Box>
              </Paper>

            <AdminInstructionsPaper/>
              {/* <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Recent Registrations
                </Typography>
                {registrations.slice(0, 3).map(reg => (
                  <Box key={reg.id} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    p: 2, 
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: colors.wheat[50],
                    '&:hover': { bgcolor: colors.wheat[100] }
                  }}>
                    <Avatar sx={{ bgcolor: colors.oliveWood[500] }}>
                      {reg.fullName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>{reg.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {reg.tripTitle}
                      </Typography>
                    </Box>
                    <Chip
                      label={reg.status}
                      size="small"
                      color={reg.status === 'confirmed' ? 'success' : 'warning'}
                    />
                  </Box>
                ))}
              </Paper> */}
            </Box>
          </Box>
        );

      case 1: // Trips
        return renderTripsGrid();

      case 2: // Updates
        return (
          <Box>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Trip Updates & Announcements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send updates to trip participants via email and WhatsApp
              </Typography>
            </Paper>

            <UpdateUploadForm
              trips={trips}
              selectedTrip={null}
              onSubmit={handleAddUpdate}
            />

            {/* Recent Updates */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Updates
              </Typography>
              {tripUpdates.slice(0, 5).map(update => {
                const trip = trips.find(t => t.id === update.tripId);
                return (
                  <Box key={update.id} sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    border: `1px solid ${colors.oliveWood[200]}`,
                    bgcolor: update.important ? colors.wheat[50] : 'transparent'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight={600}>{update.title}</Typography>
                      <Chip
                        label={trip?.title || 'Unknown Trip'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {update.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(update.date).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={`Sent via ${update.sentTo}`}
                        size="small"
                        icon={update.sentTo.includes('whatsapp') ? <FaWhatsapp /> : <FiMail />}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Paper>
          </Box>
        );

      case 3: // Registrations
        return (
          <Box>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Registration Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, confirm, and manage trip registrations
              </Typography>
            </Paper>

            <RegistrationsTable
              registrations={registrations}
              trips={trips}
              onConfirm={handleConfirmRegistration}
              onViewDetails={handleViewRegistrationDetails}
              onFilter={(filters) => {
                console.log('Applying filters:', filters);
              }}
            />
          </Box>
        );

      // case 4: // Analytics
        return (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Coming soon - Revenue tracking, participant analytics, and performance metrics
            </Typography>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <FiTrendingUp size={64} color={colors.oliveWood[300]} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Analytics module under development
              </Typography>
            </Box>
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <Paper sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        borderRadius: 0,
        borderRight: `1px solid ${colors.darkKhakhi[200]}`,
        bgcolor: 'white'
      }}>
        {/* Logo */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.darkKhakhi[200]}` }}>
          <Typography variant="h5" fontWeight={800} color={colors.oliveWood[700]}>
            TRAVAUNI ADMIN
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Complete Management Dashboard
          </Typography>
        </Box>

        {/* Navigation */}
        <List sx={{ p: 2 }}>
          {tabs.map((tab) => (
            <ListItem
              key={tab.id}
              button
              selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                mb: 1,
                borderRadius: 2,
                cursor: 'pointer',
                '&.Mui-selected': {
                  bgcolor: `${colors.oliveWood[500]}15`,
                  color: colors.oliveWood[700],
                  '&:hover': {
                    bgcolor: `${colors.oliveWood[500]}25`,
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText 
                primary={tab.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ p: 3, mt: 'auto', borderTop: `1px solid ${colors.darkKhakhi[200]}` }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FiLogOut />}
            onClick={handleLogout}
            sx={{
              borderColor: colors.darkKhakhi[300],
              color: colors.darkKhakhi[700]
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <AppBar 
          position="sticky"
          sx={{ 
            bgcolor: 'white',
            borderBottom: `1px solid ${colors.darkKhakhi[200]}`,
            boxShadow: 'none'
          }}
        >
          <Toolbar>
            <IconButton
              sx={{ display: { md: 'none' }, mr: 2 }}
              onClick={() => setMobileDrawerOpen(true)}
            >
              <FiMenu />
            </IconButton>

            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: colors.darkKhakhi[900],
                flex: 1
              }}
            >
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton>
                <FiBell />
              </IconButton>
              
              <Button
                variant="outlined"
                endIcon={<FiChevronDown />}
                onClick={handleMenuClick}
                sx={{
                  borderColor: colors.darkKhakhi[300],
                  color: colors.darkKhakhi[700]
                }}
              >
                Admin User
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* <MenuItem onClick={handleExportData}>
                  <ListItemIcon><FiDownload /></ListItemIcon>
                  Export Data
                </MenuItem> */}
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon><FiSettings /></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={()=>registerAdminsHandler()}>
                  <ListItemIcon><FiLogOut /></ListItemIcon>
                 Add Admin
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><FiLogOut /></ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Area */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" fontWeight={800} sx={{ p: 2 }}>
            TRAVAUNI ADMIN
          </Typography>
          <List>
            {tabs.map((tab) => (
              <ListItem
                key={tab.id}
                button
                selected={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileDrawerOpen(false);
                }}
              >
                <ListItemIcon>{tab.icon}</ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Modals */}
      <TripDetailsPanel
        trip={selectedTrip}
        open={showTripDetails}
        onClose={() => setShowTripDetails(false)}
      />

      <RegistrationDetailsModal
        registration={selectedRegistration}
        open={showRegistrationDetails}
        onClose={() => setShowRegistrationDetails(false)}
        onConfirm={handleConfirmRegistration}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;