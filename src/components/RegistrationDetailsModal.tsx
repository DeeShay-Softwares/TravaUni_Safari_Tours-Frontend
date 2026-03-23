// src/components/RegistrationDetailsModal.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material';
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiFileText,
  FiBook,
  FiShield
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';
import type { Registration } from '../types';

interface RegistrationDetailsModalProps {
  registration: Registration | null;
  open: boolean;
  onClose: () => void;
  onConfirm?: (registrationId: string) => void;
}

const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  registration,
  open,
  onClose,
  onConfirm
}) => {
  if (!registration) return null;

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '90%', md: 850 },
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 0,
    overflow: 'auto',
    '&::-webkit-scrollbar': { display: 'none' }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(registration.id);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{
          p: 3,
          background: `linear-gradient(135deg, ${colors.oliveWood[50]} 0%, ${colors.darkKhakhi[50]} 100%)`,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 3,
            alignItems: 'center'
          }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: colors.oliveWood[500] }}>
              {registration.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h2" fontWeight={700}>
                {registration.fullName}
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, auto))',
                gap: 1,
                mt: 1
              }}>
                <Chip
                  label={registration.status.toUpperCase()}
                  color={registration.status === 'confirmed' ? 'success' : 'warning'}
                  size="small"
                />
                <Chip
                  label={registration.paymentStatus.toUpperCase()}
                  color={registration.paymentStatus === 'paid' ? 'success' : 'warning'}
                  size="small"
                />
                {registration.isStudent && (
                  <Chip label="STUDENT" color="info" size="small" />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <FiX />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3
        }}>
          {/* Left Column - Personal Details */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 2
          }}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Personal Information
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
            
            <List dense sx={{ p: 0 }}>
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiUser color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" fontWeight={600}>{registration.fullName}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiMail color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{registration.email}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiPhone color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1">{registration.phoneNumber}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiCalendar color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Age</Typography>
                    <Typography variant="body1">{registration.age} years old</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiMapPin color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nationality</Typography>
                    <Typography variant="body1">{registration.nationality}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              {registration.isStudent && (
                <>
                  <ListItem sx={{ p: 0, mb: 1.5 }}>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 2,
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <ListItemIcon sx={{ minWidth: 40 }}><FiBook color={colors.oliveWood[500]} /></ListItemIcon>
                      <Box>
                        <Typography variant="caption" color="text.secondary">University</Typography>
                        <Typography variant="body1">{registration.university}</Typography>
                      </Box>
                    </Box>
                  </ListItem>
                  
                  <ListItem sx={{ p: 0, mb: 1.5 }}>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 2,
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <ListItemIcon sx={{ minWidth: 40 }}><FiFileText color={colors.oliveWood[500]} /></ListItemIcon>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Student ID</Typography>
                        <Typography variant="body1">{registration.studentId}</Typography>
                      </Box>
                    </Box>
                  </ListItem>
                </>
              )}
            </List>
          </Paper>

          {/* Right Column - Booking & Payment */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: 2
          }}>
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Booking & Payment
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>
            
            <List dense sx={{ p: 0 }}>
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiFileText color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Booking ID</Typography>
                    <Typography variant="body1" fontWeight={600}>{registration.bookingId}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiCalendar color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Registration Date</Typography>
                    <Typography variant="body1">{new Date(registration.registrationDate).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiDollarSign color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Payment Amount</Typography>
                    <Typography variant="body1" fontWeight={600} color={colors.oliveWood[600]}>
                      ${registration.paymentAmount}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              
              <ListItem sx={{ p: 0, mb: 1.5 }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 2,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><FiShield color={colors.oliveWood[500]} /></ListItemIcon>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Emergency Contact</Typography>
                    <Typography variant="body1">
                      {registration.emergencyContact.name} ({registration.emergencyContact.relationship}) - {registration.emergencyContact.phone}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              
              {registration.medicalConditions && (
                <ListItem sx={{ p: 0, mb: 1.5 }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">Medical Conditions</Typography>
                    <Typography variant="body1">{registration.medicalConditions}</Typography>
                  </Box>
                </ListItem>
              )}
              
              {registration.dietaryRestrictions && (
                <ListItem sx={{ p: 0, mb: 1.5 }}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary">Dietary Restrictions</Typography>
                    <Typography variant="body1">{registration.dietaryRestrictions}</Typography>
                  </Box>
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Payment Proof - Full width */}
          {registration.paymentProof && (
            <Box sx={{ 
              gridColumn: { xs: '1', md: 'span 2' },
              display: 'grid',
              gridTemplateRows: 'auto auto',
              gap: 2
            }}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                  Payment Proof
                </Typography>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateRows: 'auto auto',
                  gap: 1,
                  justifyContent: 'center'
                }}>
                  <img
                    src={registration.paymentProof}
                    alt="Payment Proof"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      border: `1px solid ${colors.darkKhakhi[200]}`
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Uploaded payment proof
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          {/* Actions - Full width */}
          <Box sx={{ 
            gridColumn: { xs: '1', md: 'span 2' },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(200px, 1fr))' },
            gap: 2,
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}>
            <Button
              variant="outlined"
              startIcon={<FaWhatsapp />}
              onClick={() => window.open(`https://wa.me/${registration.whatsappNumber || registration.phoneNumber}`, '_blank')}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              WhatsApp
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<FiMail />}
              onClick={() => window.location.href = `mailto:${registration.email}`}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Send Email
            </Button>
            
            {registration.status === 'pending' && onConfirm && (
              <Button
                variant="contained"
                startIcon={<FiCheckCircle />}
                onClick={handleConfirm}
                sx={{ 
                  bgcolor: colors.oliveWood[500],
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Confirm Registration
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default RegistrationDetailsModal;