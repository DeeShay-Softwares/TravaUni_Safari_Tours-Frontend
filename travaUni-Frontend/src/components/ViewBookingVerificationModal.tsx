// src/components/BookingVerificationModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {  FiKey, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';

interface BookingVerificationModalProps {
  open: boolean;
  onClose: () => void;
  onVerificationSuccess: (bookingId: string, phoneNumber: string) => void;
}

const ViewBookingVerificationModal: React.FC<BookingVerificationModalProps> = ({
  open,
  onClose,
  onVerificationSuccess
}) => {
  const [verificationData, setVerificationData] = useState({
    bookingId: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple validation
    if (!verificationData.bookingId || !verificationData.phoneNumber) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Simulate API call to verify booking
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would check against your database
      // For now, we'll simulate a successful verification
      onVerificationSuccess(verificationData.bookingId, verificationData.phoneNumber);
      
    } catch (err) {
      setError('Invalid booking ID or phone number. Please try again.');
       console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 0,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Box sx={{
          p: 3,
          background: `linear-gradient(135deg, ${colors.oliveWood[100]} 0%, ${colors.darkKhakhi[100]} 100%)`,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FiKey size={24} color={colors.oliveWood[600]} />
            <Typography variant="h5" fontWeight={700} color={colors.oliveWood[700]}>
              View Your Booked Trips
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Enter your booking details to access your trips
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              label="Booking ID"
              name="bookingId"
              value={verificationData.bookingId}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              placeholder="e.g., TRAVA-2024-00123"
              InputProps={{
                startAdornment: <FiKey style={{ marginRight: 8, color: colors.oliveWood[500] }} />
              }}
              helperText="Found in your booking confirmation"
            />

            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phoneNumber"
              value={verificationData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              placeholder="e.g., 0780264423"
              InputProps={{
                startAdornment: <FiPhone style={{ marginRight: 8, color: colors.oliveWood[500] }} />
              }}
              helperText="Phone number used during booking"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: colors.oliveWood[500],
                '&:hover': { backgroundColor: colors.oliveWood[600] }
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'View My Trips'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have your booking ID?
              </Typography>
              <Button
                startIcon={<FaWhatsapp />}
                onClick={() => window.open('https://wa.me/0780264423', '_blank')}
                sx={{
                  mt: 1,
                  color: colors.oliveWood[600],
                  '&:hover': { color: colors.oliveWood[700] }
                }}
              >
                Contact us on WhatsApp
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ViewBookingVerificationModal;