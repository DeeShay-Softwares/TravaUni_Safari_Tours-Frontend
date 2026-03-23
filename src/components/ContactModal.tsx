// src/components/ContactModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { FiX, FiMail, FiMessageSquare, FiSend, FiUser, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  whatsappUrl?: string; // Your WhatsApp URL
}

const whatsappUrll = 'https://wa.me/012345678';

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose, whatsappUrl= whatsappUrll }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // In a real app, you would send this to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  // Modal style
  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: 600 },
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 0,
    border: `2px solid ${colors.oliveWood[100]}`,
     overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
  };

  // Handle WhatsApp button click
  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="contact-modal"
      aria-describedby="contact-form-modal"
    >
      <Paper sx={modalStyle}>
        {/* Modal Header */}
        <Box sx={{
          p: 3,
          background: `linear-gradient(135deg, ${colors.oliveWood[100]} 0%, ${colors.darkKhakhi[100]} 100%)`,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1,
              borderRadius: '50%',
              bgcolor: colors.oliveWood[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiMessageCircle size={24} color="white" />
            </Box>
            <Typography variant="h4" component="h2" fontWeight={700} color={colors.oliveWood[700]}>
              Contact Me
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: colors.oliveWood[700] }}>
            <FiX size={24} />
          </IconButton>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Message sent successfully! I'll get back to you soon.
            </Alert>
          )}
          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage || 'Something went wrong. Please try again.'}
            </Alert>
          )}

          {/* Two Column Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            
            {/* Left Column - Contact Options */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Quick Contact
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose your preferred way to get in touch
              </Typography>

              {/* WhatsApp Button */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<FaWhatsapp size={20} />}
                onClick={handleWhatsAppClick}
                sx={{
                  mb: 3,
                  py: 2,
                  borderRadius: 2,
                  backgroundColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  }
                }}
              >
                Chat on WhatsApp
              </Button>

              {/* Contact Information */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                  <FiMail style={{ marginRight: 8 }} />
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  I typically respond within 24 hours
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                  <FiMessageSquare style={{ marginRight: 8 }} />
                  Response Time
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • WhatsApp: Usually within a few hours
                  <br />
                  • Email: Within 24 hours
                </Typography>
              </Box>
            </Box>

            {/* Right Column - Contact Form */}
            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Send a Message
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <FiUser style={{ marginRight: 8, color: colors.oliveWood[500] }} />
                  }}
                />

                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <FiMail style={{ marginRight: 8, color: colors.oliveWood[500] }} />
                  }}
                />

                <TextField
                  fullWidth
                  required
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <FiSend />}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    backgroundColor: colors.oliveWood[500],
                    '&:hover': {
                      backgroundColor: colors.oliveWood[600],
                    },
                    '&:disabled': {
                      backgroundColor: colors.oliveWood[300],
                    }
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ContactModal;