import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  FiUpload,
  FiMessageSquare,
  FiUsers,
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiDownload,
  FiFilter,
  FiMail,
  FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';

const AdminInstructionsPaper: React.FC = () => {
  return (
    <Paper sx={{ 
      p: 4, 
      borderRadius: 3,
      maxWidth: 1000,
      mx: 'auto',
      mt: 4,
      border: `2px solid ${colors.oliveWood[200]}`,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={800} 
          gutterBottom
          sx={{ 
            color: colors.oliveWood[700],
            background: `linear-gradient(135deg, ${colors.oliveWood[700]} 0%, ${colors.bronze[500]} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Admin Dashboard Guide
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Complete guide to managing trips, updates, and registrations
        </Typography>
      </Box>

      {/* Quick Start Alert */}
      <Alert 
        severity="info" 
        icon={<FiAlertCircle />}
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          backgroundColor: colors.oliveWood[50]
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          Quick Start: Use the sidebar navigation to switch between different management sections
        </Typography>
      </Alert>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Trip Management */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            border: `2px solid ${colors.oliveWood[100]}`,
            borderRadius: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              borderColor: colors.oliveWood[300]
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
              }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  backgroundColor: colors.oliveWood[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiUpload size={24} color={colors.oliveWood[600]} />
                </Box>
                <Typography variant="h5" fontWeight={700} color={colors.oliveWood[700]}>
                  Trip Management
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Upload, edit, and manage all travel packages
              </Typography>

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiUpload color={colors.oliveWood[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Upload New Trip"
                    secondary="Click 'Upload Trip' button to add new packages"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiEdit color={colors.oliveWood[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Edit Existing Trips"
                    secondary="Click the eye menu on any trip card"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiEye color={colors.oliveWood[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Preview Trip"
                    secondary="See how the trip appears to customers"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.oliveWood[100]}` }}>
                <Chip 
                  label="Required Fields" 
                  size="small" 
                  color="primary" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label="Image URL" 
                  size="small" 
                  variant="outlined" 
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label="Pricing" 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Updates Management */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            border: `2px solid ${colors.wheat[100]}`,
            borderRadius: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              borderColor: colors.wheat[300]
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
              }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  backgroundColor: colors.wheat[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiMessageSquare size={24} color={colors.wheat[600]} />
                </Box>
                <Typography variant="h5" fontWeight={700} color={colors.wheat[700]}>
                  Send Updates
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Communicate important information to trip participants
              </Typography>

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiMessageSquare color={colors.wheat[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Create Update"
                    secondary="Go to Updates tab and fill the form"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiMail color={colors.wheat[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Notifications"
                    secondary="Select email option to notify participants"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FaWhatsapp color="#25D366" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="WhatsApp Messages"
                    secondary="Updates can be sent to WhatsApp groups"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>

              <Alert 
                severity="warning" 
                sx={{ 
                  mt: 3, 
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }}
              >
                <Typography variant="body2">
                  <strong>Important:</strong> Mark updates as "Important" for urgent communications
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Registration Management */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            border: `2px solid ${colors.darkKhakhi[100]}`,
            borderRadius: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              borderColor: colors.darkKhakhi[300]
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
              }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  backgroundColor: colors.darkKhakhi[100],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiUsers size={24} color={colors.darkKhakhi[600]} />
                </Box>
                <Typography variant="h5" fontWeight={700} color={colors.darkKhakhi[700]}>
                  View Registrations
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                Manage all customer bookings and confirmations
              </Typography>

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiCheckCircle color={colors.darkKhakhi[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Confirm Bookings"
                    secondary="Click checkmark icon to confirm registrations"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiEye color={colors.darkKhakhi[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="View Details"
                    secondary="Click eye icon to see full registration info"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiFilter color={colors.darkKhakhi[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Filter & Search"
                    secondary="Use filters to find specific registrations"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                {/* <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FiDownload color={colors.darkKhakhi[500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Export Data"
                    secondary="Download registration data as CSV/Excel"
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem> */}
              </List>

              <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.darkKhakhi[100]}` }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Status Legend:</strong> 
                  <Chip label="Pending" size="small" color="warning" sx={{ ml: 1, mr: 0.5 }} />
                  <Chip label="Confirmed" size="small" color="success" sx={{ mr: 0.5 }} />
                  <Chip label="Cancelled" size="small" color="error" />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }}>
        <Chip label="Key Features" />
      </Divider>

      {/* Feature Highlights */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          backgroundColor: colors.oliveWood[50],
          borderLeft: `4px solid ${colors.oliveWood[500]}`
        }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Real-time Updates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Changes appear immediately or may load for some time to show on the main website
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          backgroundColor: colors.wheat[50],
          borderLeft: `4px solid ${colors.wheat[500]}`
        }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Email Automation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Automatic confirmation emails when booking status changes
          </Typography>
        </Box>

        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          backgroundColor: colors.darkKhakhi[50],
          borderLeft: `4px solid ${colors.darkKhakhi[500]}`
        }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Payment Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View payment status and proof of payment for each booking
          </Typography>
        </Box>
      </Box>

      {/* Support Section */}
      <Alert 
        severity="info"
        sx={{ 
          borderRadius: 2,
          backgroundColor: colors.oliveWood[50],
          border: `1px solid ${colors.oliveWood[200]}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <FiAlertCircle size={24} color={colors.oliveWood[600]} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2">
              Contact system administrator for technical support or training or any when you notice any bugs
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Support Email: dmucheche2004@gmail.com | WhatsApp: +263780264423
            </Typography>
          </Box>
        </Box>
      </Alert>

      {/* Footer */}
      <Box sx={{ 
        mt: 4, 
        pt: 3, 
        borderTop: `1px solid ${colors.oliveWood[200]}`,
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()} | Version 1
        </Typography>
      </Box>
    </Paper>
  );
};

export default AdminInstructionsPaper;