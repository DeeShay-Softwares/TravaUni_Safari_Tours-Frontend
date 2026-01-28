// PaymentDetails.tsx - Step 5 with CSS Grid
import { Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, Divider } from '@mui/material';
import { FaCreditCard, FaPaypal, FaBuilding, FaLock } from 'react-icons/fa6';
import { Theme } from '@/assets/constants/colors';
import { useState } from 'react';

export default function PaymentDetails() {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholder: ''
  });

  const handleCardChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Payment submitted');
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr',
      gap: 3,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <Typography variant="h4" sx={{
        color: Theme.bronze[700],
        fontWeight: 600
      }}>
        Payment Details
      </Typography>
      
      <Typography sx={{
        color: Theme['dark-khakhi'][600],
        fontSize: '16px'
      }}>
        Complete your booking with secure payment
      </Typography>

      {/* Main Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 4,
        alignContent: 'start'
      }}>
        {/* Payment Form */}
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: 3,
          backgroundColor: 'white',
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: 2
        }}>
          {/* Payment Method Selection */}
          <Box>
            <Typography variant="h6" sx={{
              color: Theme['dark-khakhi'][800],
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1,
              alignItems: 'center',
              mb: 3
            }}>
              <FaLock color={Theme.bronze[500]} />
              Select Payment Method
            </Typography>
            
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(3, auto)',
                gap: 2
              }}
            >
              <FormControlLabel
                value="credit"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2, alignItems: 'center' }}>
                    <FaCreditCard size={24} color={Theme.bronze[500]} />
                    <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                      Credit/Debit Card
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2, alignItems: 'center' }}>
                    <FaPaypal size={24} color={Theme.bronze[500]} />
                    <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                      PayPal
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                value="bank"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2, alignItems: 'center' }}>
                    <FaBuilding size={24} color={Theme.bronze[500]} />
                    <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                      Bank Transfer
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Box>
          
          {/* Payment Details */}
          {paymentMethod === 'credit' && (
            <Box sx={{
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
              gap: 3
            }}>
              <Divider />
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2
              }}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                />
                
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                />
                
                <TextField
                  fullWidth
                  label="CVV"
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardChange('cvv', e.target.value)}
                  placeholder="123"
                />
                
                <TextField
                  fullWidth
                  label="Cardholder Name"
                  value={cardDetails.cardholder}
                  onChange={(e) => handleCardChange('cardholder', e.target.value)}
                  placeholder="As shown on card"
                  sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}
                />
              </Box>
            </Box>
          )}
          
          {paymentMethod === 'paypal' && (
            <Box sx={{
              display: 'grid',
              placeItems: 'center',
              py: 4,
              gap: 2
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600], textAlign: 'center' }}>
                You will be redirected to PayPal to complete your payment
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#003087',
                  '&:hover': { backgroundColor: '#00256B' },
                  width: 'fit-content'
                }}
              >
                Continue to PayPal
              </Button>
            </Box>
          )}
          
          {paymentMethod === 'bank' && (
            <Box sx={{
              p: 3,
              backgroundColor: Theme.wheat[50],
              borderRadius: 2,
              borderLeft: `4px solid ${Theme['olive-wood'][500]}`,
              display: 'grid',
              gap: 1
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                Bank Transfer Details:
              </Typography>
              <Box sx={{
                display: 'grid',
                gridTemplateRows: 'repeat(5, auto)',
                gap: 0.5
              }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Account Name: TravaUni Safari Tours
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Bank: Safari Bank International
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Account Number: 1234 5678 9012
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  SWIFT: SBIUS33
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Reference: Your Booking ID
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Security Note */}
          <Box sx={{
            backgroundColor: Theme['olive-wood'][50],
            borderRadius: 2,
            p: 2,
            border: `1px solid ${Theme['olive-wood'][200]}`,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 1,
            alignItems: 'flex-start'
          }}>
            <FaLock style={{ marginTop: 2 }} />
            <Typography sx={{
              color: Theme['dark-khakhi'][600],
              fontSize: '14px'
            }}>
              Your payment is secured with 256-bit SSL encryption. We never store your card details.
            </Typography>
          </Box>
        </Box>
        
        {/* Summary Panel */}
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          gap: 3,
          backgroundColor: Theme.bronze[50],
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          border: `2px solid ${Theme.bronze[200]}`,
          alignContent: 'start'
        }}>
          <Typography variant="h6" sx={{
            color: Theme.bronze[800],
            fontWeight: 600
          }}>
            Ready to Book!
          </Typography>
          
          <Box sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(4, auto)',
            gap: 2
          }}>
            <Typography sx={{
              color: Theme['dark-khakhi'][700],
              fontSize: '15px'
            }}>
              By completing this booking, you agree to our Terms & Conditions and Privacy Policy.
            </Typography>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1,
              alignItems: 'center'
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: `2px solid ${Theme['olive-wood'][500]}`,
                display: 'grid',
                placeItems: 'center'
              }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '2px',
                  backgroundColor: Theme['olive-wood'][500]
                }} />
              </Box>
              <Typography sx={{
                color: Theme['olive-wood'][600],
                fontSize: '14px'
              }}>
                Secure payment
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1,
              alignItems: 'center'
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: `2px solid ${Theme['olive-wood'][500]}`,
                display: 'grid',
                placeItems: 'center'
              }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '2px',
                  backgroundColor: Theme['olive-wood'][500]
                }} />
              </Box>
              <Typography sx={{
                color: Theme['dark-khakhi'][600],
                fontSize: '14px'
              }}>
                Instant confirmation
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1,
              alignItems: 'center'
            }}>
              <Box sx={{
                width: 20,
                height: 20,
                borderRadius: '4px',
                border: `2px solid ${Theme['olive-wood'][500]}`,
                display: 'grid',
                placeItems: 'center'
              }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '2px',
                  backgroundColor: Theme['dark-khakhi'][500]
                }} />
              </Box>
              <Typography sx={{
                color: Theme['dark-khakhi'][600],
                fontSize: '14px'
              }}>
                24/7 support
              </Typography>
            </Box>
          </Box>
          
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: Theme['olive-wood'][500],
              '&:hover': { backgroundColor: Theme['olive-wood'][600] },
              py: 1.5,
              fontSize: '16px',
              fontWeight: 600
            }}
          >
            Complete Booking
          </Button>
          
          <Typography sx={{
            color: Theme['dark-khakhi'][500],
            fontSize: '12px',
            textAlign: 'center'
          }}>
            You will receive a confirmation email within 15 minutes
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}