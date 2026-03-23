// PaymentDetails.tsx - Step 5 with Mobile Money (Airtel & MTN)
import { Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, Divider, Alert, CircularProgress } from '@mui/material';
import { FaCreditCard, FaBuilding, FaLock, FaClock } from 'react-icons/fa6';
import { FaAccusoft, FaMobileAlt,FaShieldAlt, FaMagic } from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';
import { useState } from 'react';

interface PaymentDetailsProps {
  bookingData?: {
    totalPrice: number;
    bookingReference?: string;
  };
  onPaymentComplete?: (paymentDetails: any) => void;
}

export default function PaymentDetails({ bookingData, onPaymentComplete }: PaymentDetailsProps) {
  const [paymentMethod, setPaymentMethod] = useState('airtel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholder: ''
  });

  const totalAmount = bookingData?.totalPrice || 2800;
  const depositAmount = Math.round(totalAmount * 0.3); // 30% deposit

  const handleMobilePayment = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid mobile number');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate API call to payment gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment
      console.log(`Processing ${paymentMethod.toUpperCase()} Mobile Money payment for ${mobileNumber}`);
      console.log(`Amount: ${depositAmount} ${paymentMethod === 'airtel' ? 'UGX' : 'UGX'}`);
      
      setPaymentStatus('success');
      
      // Notify parent component
      onPaymentComplete?.({
        method: paymentMethod,
        mobileNumber,
        amount: depositAmount,
        currency: 'UGX',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholder) {
      alert('Please fill in all card details');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Processing card payment');
      setPaymentStatus('success');
      onPaymentComplete?.({
        method: 'card',
        cardDetails,
        amount: depositAmount,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = () => {
    setPaymentStatus('processing');
    // Simulate bank transfer initiation
    setTimeout(() => {
      setPaymentStatus('success');
      onPaymentComplete?.({
        method: 'bank',
        amount: depositAmount,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });
    }, 1500);
  };

  const handleCardChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatMobileNumber = (value: string) => {
    // Format for Ugandan numbers: 07XX XXX XXX or 2567XX XXX XXX
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header Section */}
      <Box>
        <Typography variant="h4" sx={{
          color: Theme.bronze[700],
          fontWeight: 600,
          mb: 1
        }}>
          Payment Details
        </Typography>
        
        <Typography sx={{
          color: Theme['dark-khakhi'][600],
          fontSize: '16px'
        }}>
          Complete your booking with secure payment
        </Typography>
      </Box>

      {/* Payment Status Alert */}
      {paymentStatus === 'success' && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Payment initiated successfully! You will receive a confirmation shortly.
        </Alert>
      )}
      
      {paymentStatus === 'error' && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Payment failed. Please try again or contact support.
        </Alert>
      )}

      {/* Main Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 4,
        flex: 1
      }}>
        {/* Payment Form */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backgroundColor: 'white',
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: 2,
          border: `1px solid ${Theme.bronze[100]}`
        }}>
          {/* Payment Method Selection */}
          <Box>
            <Typography variant="h6" sx={{
              color: Theme['dark-khakhi'][800],
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}>
              <FaLock size={18} color={Theme.bronze[500]} />
              Select Payment Method
            </Typography>
            
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentStatus('idle');
              }}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 2
              }}
            >
              {/* Airtel Money */}
              <FormControlLabel
                value="airtel"
                control={<Radio />}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    border: paymentMethod === 'airtel' ? `2px solid ${Theme.bronze[500]}` : `1px solid ${Theme['dark-khakhi'][200]}`,
                    backgroundColor: paymentMethod === 'airtel' ? Theme.bronze[50] : 'white',
                    width: '100%'
                  }}>
                    <FaAccusoft size={32} color="#E3000F" />
                    <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 500, fontSize: '14px' }}>
                      Airtel Money
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
              
              {/* MTN Mobile Money */}
              <FormControlLabel
                value="mtn"
                control={<Radio />}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    border: paymentMethod === 'mtn' ? `2px solid ${Theme.bronze[500]}` : `1px solid ${Theme['dark-khakhi'][200]}`,
                    backgroundColor: paymentMethod === 'mtn' ? Theme.bronze[50] : 'white',
                    width: '100%'
                  }}>
                    <FaMagic size={32} color="#FFCC00" />
                    <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 500, fontSize: '14px' }}>
                      MTN Mobile Money
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
              
              <FormControlLabel
                value="credit"
                control={<Radio />}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    border: paymentMethod === 'credit' ? `2px solid ${Theme.bronze[500]}` : `1px solid ${Theme['dark-khakhi'][200]}`,
                    backgroundColor: paymentMethod === 'credit' ? Theme.bronze[50] : 'white',
                    width: '100%'
                  }}>
                    <FaCreditCard size={32} color={Theme.bronze[600]} />
                    <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 500, fontSize: '14px' }}>
                      Card Payment
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
              
              {/* Bank Transfer */}
              <FormControlLabel
                value="bank"
                control={<Radio />}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 2,
                    borderRadius: 2,
                    border: paymentMethod === 'bank' ? `2px solid ${Theme.bronze[500]}` : `1px solid ${Theme['dark-khakhi'][200]}`,
                    backgroundColor: paymentMethod === 'bank' ? Theme.bronze[50] : 'white',
                    width: '100%'
                  }}>
                    <FaBuilding size={32} color={Theme['olive-wood'][600]} />
                    <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 500, fontSize: '14px' }}>
                      Bank Transfer
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </RadioGroup>
          </Box>
          
          <Divider />
          
          {/* Mobile Money Payment Form (Airtel & MTN) */}
          {(paymentMethod === 'airtel' || paymentMethod === 'mtn') && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              <Box sx={{
                p: 3,
                backgroundColor: Theme.wheat[50],
                borderRadius: 2,
                borderLeft: `4px solid ${paymentMethod === 'airtel' ? '#E3000F' : '#FFCC00'}`
              }}>
                <Typography sx={{ 
                  color: Theme['dark-khakhi'][800], 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <FaMobileAlt />
                  {paymentMethod === 'airtel' ? 'Airtel Money' : 'MTN Mobile Money'} Payment
                </Typography>
                
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', mb: 3 }}>
                  Enter your {paymentMethod === 'airtel' ? 'Airtel' : 'MTN'} mobile number to receive a payment prompt
                </Typography>
                
                <TextField
                  fullWidth
                  label="Mobile Number"
                  placeholder={paymentMethod === 'airtel' ? '07XX XXX XXX' : '07XX XXX XXX'}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(formatMobileNumber(e.target.value))}
                  helperText="Format: 07XXXXXXXX (10 digits)"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: Theme['olive-wood'][400] },
                      '&.Mui-focused fieldset': { borderColor: Theme['olive-wood'][500] }
                    }
                  }}
                />
                
                <Box sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  p: 2,
                  mb: 3
                }}>
                  <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px', mb: 1 }}>
                    Payment Summary:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '14px' }}>Deposit Amount (30%)</Typography>
                    <Typography sx={{ fontWeight: 600, color: Theme.bronze[700] }}>
                      UGX {depositAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>
                    You will be prompted to enter your PIN on your mobile device
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleMobilePayment}
                  disabled={isProcessing || !mobileNumber || mobileNumber.length < 10}
                  sx={{
                    backgroundColor: paymentMethod === 'airtel' ? '#E3000F' : '#FFCC00',
                    color: paymentMethod === 'airtel' ? 'white' : '#000',
                    '&:hover': {
                      backgroundColor: paymentMethod === 'airtel' ? '#C1000D' : '#E6B800',
                    },
                    py: 1.5,
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Pay UGX ${depositAmount.toLocaleString()} via ${paymentMethod === 'airtel' ? 'Airtel Money' : 'MTN Mobile Money'}`
                  )}
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Credit Card Payment Form */}
          {paymentMethod === 'credit' && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
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
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleCardPayment}
                disabled={isProcessing}
                sx={{
                  backgroundColor: Theme['olive-wood'][500],
                  '&:hover': { backgroundColor: Theme['olive-wood'][600] },
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Pay ${depositAmount} USD via Card`
                )}
              </Button>
            </Box>
          )}
          
          {/* Bank Transfer Payment Form */}
          {paymentMethod === 'bank' && (
            <Box sx={{
              p: 3,
              backgroundColor: Theme.wheat[50],
              borderRadius: 2,
              borderLeft: `4px solid ${Theme['olive-wood'][500]}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600 }}>
                Bank Transfer Details:
              </Typography>
              <Box sx={{
                display: 'grid',
                gap: 1
              }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  <strong>Account Name:</strong> TravaUni Safari Tours
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  <strong>Bank:</strong> Centenary Bank Uganda
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  <strong>Account Number:</strong> 1234 5678 9012
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  <strong>SWIFT:</strong> CEBUUGKA
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  <strong>Reference:</strong> {bookingData?.bookingReference || 'Your Booking ID'}
                </Typography>
                <Typography sx={{ color: Theme.bronze[600], fontSize: '13px', mt: 1 }}>
                  Amount to transfer: UGX {depositAmount.toLocaleString()}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleBankTransfer}
                disabled={isProcessing}
                sx={{
                  backgroundColor: Theme.bronze[600],
                  '&:hover': { backgroundColor: Theme.bronze[700] },
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 600,
                  mt: 2
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'I\'ve Made the Transfer'
                )}
              </Button>
            </Box>
          )}
          
          {/* Security Note */}
          <Box sx={{
            backgroundColor: Theme['olive-wood'][50],
            borderRadius: 2,
            p: 2,
            border: `1px solid ${Theme['olive-wood'][200]}`,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start'
          }}>
            <FaShieldAlt size={18} color={Theme['olive-wood'][600]} />
            <Typography sx={{
              color: Theme['dark-khakhi'][600],
              fontSize: '13px'
            }}>
              Your payment is secured with 256-bit SSL encryption. We never store your payment details.
            </Typography>
          </Box>
        </Box>
        
        {/* Summary Panel */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backgroundColor: Theme.bronze[50],
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          border: `2px solid ${Theme.bronze[200]}`,
          position: 'sticky',
          top: 20,
          alignSelf: 'start'
        }}>
          <Typography variant="h6" sx={{
            color: Theme.bronze[800],
            fontWeight: 700
          }}>
            Payment Summary
          </Typography>
          
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '18px', color: Theme.bronze[700] }}>
                {paymentMethod === 'airtel' || paymentMethod === 'mtn' ? 'UGX' : 'USD'} {totalAmount.toLocaleString()}
              </Typography>
            </Box>
            
            <Divider sx={{ borderColor: Theme.bronze[200] }} />
            
            <Box>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px', mb: 1 }}>
                <FaClock size={12} style={{ marginRight: 8 }} />
                Deposit Required
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '24px', color: Theme.bronze[800] }}>
                {paymentMethod === 'airtel' || paymentMethod === 'mtn' ? 'UGX' : 'USD'} {depositAmount.toLocaleString()}
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px', mt: 0.5 }}>
                30% deposit to secure your booking
              </Typography>
            </Box>
            
            <Box sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: 2,
              mt: 1
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', mb: 1 }}>
                Remaining Balance:
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '18px', color: Theme.bronze[700] }}>
                {paymentMethod === 'airtel' || paymentMethod === 'mtn' ? 'UGX' : 'USD'} {(totalAmount - depositAmount).toLocaleString()}
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '11px' }}>
                Due 14 days before departure
              </Typography>
            </Box>
          </Box>
          
          <Divider />
          
          {/* Benefits */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}>
            <Typography sx={{ color: Theme['dark-khakhi'][700], fontWeight: 500, fontSize: '14px' }}>
              ✓ Secure payment
            </Typography>
            <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px' }}>
              ✓ Instant confirmation via SMS & Email
            </Typography>
            <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px' }}>
              ✓ 24/7 customer support
            </Typography>
            <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px' }}>
              ✓ Free cancellation up to 14 days before travel
            </Typography>
          </Box>
          
          <Divider />
          
          <Typography sx={{
            color: Theme['dark-khakhi'][500],
            fontSize: '11px',
            textAlign: 'center'
          }}>
            By proceeding, you agree to our Terms & Conditions and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}