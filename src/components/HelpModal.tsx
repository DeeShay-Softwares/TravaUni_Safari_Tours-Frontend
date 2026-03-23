// src/components/HelpModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { FiX, FiChevronDown, FiHelpCircle, FiMail, FiMessageSquare } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  whatsappUrl?: string;
  contactEmail?: string;
}

// FAQ Data Object - Easy to edit
const FAQ_DATA = [
  {
    id: 1,
    question: "How do I book a trip?",
    answer: "To book a trip, simply click on the trip card you're interested in, then click the 'Book Now' button in the trip details panel. You'll be guided through our easy 3-step booking process: select dates, choose add-ons, and complete payment."
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are securely processed through encrypted channels for your safety."
  },
  {
    id: 3,
    question: "Can I cancel or modify my booking?",
    answer: "Yes! You can cancel or modify your booking up to 7 days before the trip departure. Please check your booking confirmation email for the cancellation policy specific to your trip. Some promotions may have different terms."
  },
  {
    id: 4,
    question: "What's included in the trip price?",
    answer: "Our trip prices typically include accommodation, transportation during the trip, guided tours, and some meals as specified in the trip details. Flights to/from the destination, travel insurance, and personal expenses are usually not included."
  },
  {
    id: 5,
    question: "Do I need travel insurance?",
    answer: "We strongly recommend travel insurance for all trips. While not mandatory for all destinations, it protects you against unexpected events like trip cancellation, medical emergencies, or lost luggage."
  },
  {
    id: 6,
    question: "What if I have special dietary requirements?",
    answer: "We accommodate dietary needs! Please mention any dietary restrictions (vegetarian, vegan, gluten-free, allergies) during booking or contact us at least 72 hours before your trip departure."
  },
  {
    id: 7,
    question: "How do group discounts work?",
    answer: "Groups of 4 or more receive a 10% discount on most trips. For larger groups (8+ people), contact us directly for custom pricing and arrangements."
  },
  {
    id: 8,
    question: "What should I pack for my trip?",
    answer: "A detailed packing list specific to your destination and trip type will be sent after booking. Generally, we recommend comfortable walking shoes, weather-appropriate clothing, and any required travel documents."
  }
];

const HelpModal: React.FC<HelpModalProps> = ({ 
  open, 
  onClose, 
  whatsappUrl = "https://wa.me/1234567890",
  contactEmail = "help@travauni.com"
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Modal style
  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '90%', md: 800 },
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 0,
    overflow: 'hidden',
    border: `2px solid ${colors.oliveWood[100]}`,
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  // Handle email click
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactEmail}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="help-modal"
      aria-describedby="frequently-asked-questions"
      sx={{
        backdropFilter: 'blur(3px)',
      }}
    >
      <Fade in={open}>
        <Paper sx={modalStyle}>
          {/* Header */}
          <Box sx={{
            p: 3,
            background: `linear-gradient(135deg, ${colors.oliveWood[50]} 0%, ${colors.darkKhakhi[50]} 100%)`,
            borderBottom: `1px solid ${colors.oliveWood[200]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                p: 1.5,
                borderRadius: '50%',
                bgcolor: colors.oliveWood[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiHelpCircle size={24} color="white" />
              </Box>
              <Box>
                <Typography variant="h4" component="h2" fontWeight={700} color={colors.oliveWood[700]}>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find answers to common questions
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={onClose}
              sx={{ 
                color: colors.oliveWood[700],
                '&:hover': { bgcolor: colors.oliveWood[100] }
              }}
            >
              <FiX size={24} />
            </IconButton>
          </Box>

          {/* Content - Scrollable area */}
          <Box sx={{
            p: { xs: 2, md: 3 },
            maxHeight: 'calc(90vh - 120px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}>
            {/* Contact Options - Always visible */}
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              bgcolor: colors.wheat[50],
              borderRadius: 2,
              border: `1px solid ${colors.wheat[200]}`,
            }}>
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Still need help? Contact us directly
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<FaWhatsapp size={18} />}
                  onClick={handleWhatsAppClick}
                  sx={{
                    flex: isMobile ? '1 1 100%' : '1',
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#25D366',
                    '&:hover': { backgroundColor: '#128C7E' }
                  }}
                >
                  WhatsApp Chat
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FiMail size={18} />}
                  onClick={handleEmailClick}
                  sx={{
                    flex: isMobile ? '1 1 100%' : '1',
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: colors.oliveWood[400],
                    color: colors.oliveWood[600],
                    '&:hover': { 
                      borderColor: colors.oliveWood[600],
                      bgcolor: colors.oliveWood[50]
                    }
                  }}
                >
                  Email Us
                </Button>
              </Box>
            </Box>

            {/* FAQ Section */}
            <Typography variant="h5" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
              Click on a question to see the answer
            </Typography>

            {/* FAQ Accordions */}
            <Box sx={{ mb: 3 }}>
              {FAQ_DATA.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === faq.id}
                  onChange={handleAccordionChange(faq.id)}
                  sx={{
                    mb: 1,
                    borderRadius: '8px !important',
                    border: `1px solid ${colors.oliveWood[100]}`,
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: '8px 0',
                      borderColor: colors.oliveWood[300],
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<FiChevronDown />}
                    sx={{
                      bgcolor: expanded === faq.id ? colors.oliveWood[50] : 'transparent',
                      borderRadius: '8px',
                      '&.Mui-expanded': {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      }
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontWeight: 600,
                        color: expanded === faq.id ? colors.oliveWood[700] : 'text.primary',
                        flex: 1,
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails 
                    sx={{ 
                      bgcolor: colors.wheat[50],
                      borderTop: `1px solid ${colors.oliveWood[100]}`,
                    }}
                  >
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Additional Help */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <FiMessageSquare size={48} color={colors.oliveWood[400]} style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom color={colors.oliveWood[600]}>
                Need more specific help?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our team is available 7 days a week to assist you
              </Typography>
              <Button
                variant="contained"
                onClick={handleWhatsAppClick}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: colors.oliveWood[500],
                  '&:hover': { backgroundColor: colors.oliveWood[600] }
                }}
              >
                Chat with Support
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default HelpModal;