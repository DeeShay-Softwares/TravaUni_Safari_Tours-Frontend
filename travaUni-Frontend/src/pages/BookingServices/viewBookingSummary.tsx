// BookingSummary.tsx - Step 4 with CSS Grid
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Chip } from '@mui/material';
import { FaCheck, FaCalendar, FaUsers, FaStar } from 'react-icons/fa6';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';

export default function BookingSummary() {
  const bookingSummary = {
    destination: "Serengeti National Park",
    package: "Premium Safari",
    travelers: 2,
    travelDate: "June 15, 2024",
    duration: "6 days",
    totalPrice: "$5,600",
    inclusions: [
      "Private lodge accommodations",
      "Daily game drives",
      "All meals and drinks",
      "Professional guide and tracker",
      "Park entrance fees",
      "Airport transfers",
      "Sundowner cocktails"
    ]
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
        Booking Summary
      </Typography>
      
      <Typography sx={{
        color: Theme['dark-khakhi'][600],
        fontSize: '16px'
      }}>
        Review your safari adventure details
      </Typography>

      {/* Main Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 4,
        alignContent: 'start'
      }}>
        {/* Left Column - Details */}
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto auto 1fr',
          gap: 3,
          backgroundColor: 'white',
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          boxShadow: 2
        }}>
          {/* Destination Header */}
          <Typography variant="h5" sx={{
            color: Theme['dark-khakhi'][800],
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 1,
            alignItems: 'center'
          }}>
            <FaMapMarkedAlt color={Theme.bronze[500]} />
            {bookingSummary.destination}
          </Typography>
          
          {/* Date & Travelers Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 2,
              alignItems: 'center',
              p: 2,
              backgroundColor: Theme.wheat[50],
              borderRadius: 2
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: Theme.bronze[100],
                display: 'grid',
                placeItems: 'center'
              }}>
                <FaCalendar color={Theme.bronze[600]} />
              </Box>
              <Box>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Travel Date
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600 }}>
                  {bookingSummary.travelDate}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 2,
              alignItems: 'center',
              p: 2,
              backgroundColor: Theme.wheat[50],
              borderRadius: 2
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: Theme['olive-wood'][100],
                display: 'grid',
                placeItems: 'center'
              }}>
                <FaUsers color={Theme['olive-wood'][600]} />
              </Box>
              <Box>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
                  Travelers
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600 }}>
                  {bookingSummary.travelers} {bookingSummary.travelers === 1 ? 'Person' : 'People'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Package Info */}
          <Box>
            <Typography variant="h6" sx={{
              color: Theme['dark-khakhi'][800],
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: 1,
              alignItems: 'center',
              mb: 1
            }}>
              <FaStar color={Theme.bronze[500]} />
              {bookingSummary.package}
            </Typography>
            <Typography sx={{
              color: Theme['dark-khakhi'][700]
            }}>
              Duration: {bookingSummary.duration}
            </Typography>
          </Box>
          
          <Divider />
          
          {/* Inclusions */}
          <Box>
            <Typography variant="h6" sx={{
              color: Theme['dark-khakhi'][800],
              mb: 2
            }}>
              Package Inclusions
            </Typography>
            <List sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1
            }}>
              {bookingSummary.inclusions.map((item, index) => (
                <ListItem key={index} sx={{ py: 1, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <FaCheck color={Theme['olive-wood'][500]} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item}
                    primaryTypographyProps={{
                      color: Theme['dark-khakhi'][700],
                      fontSize: '14px'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        
        {/* Right Column - Price Summary */}
        <Box sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr auto',
          gap: 3,
          backgroundColor: Theme.bronze[50],
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          border: `2px solid ${Theme.bronze[200]}`
        }}>
          <Typography variant="h6" sx={{
            color: Theme.bronze[800],
            fontWeight: 600
          }}>
            Price Summary
          </Typography>
          
          {/* Price Breakdown */}
          <Box sx={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, auto)',
            gap: 2
          }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 1
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600] }}>
                Package x{bookingSummary.travelers}
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                $2,800 × {bookingSummary.travelers}
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 1
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600] }}>
                Taxes & Fees
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                $120
              </Typography>
            </Box>
            
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 1
            }}>
              <Typography sx={{ color: Theme['dark-khakhi'][600] }}>
                Conservation Fee
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][800] }}>
                $50
              </Typography>
            </Box>
          </Box>
          
          <Divider />
          
          {/* Total */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: 1
          }}>
            <Typography variant="h5" sx={{
              color: Theme.bronze[800],
              fontWeight: 700
            }}>
              Total
            </Typography>
            <Typography variant="h4" sx={{
              color: Theme.bronze[800],
              fontWeight: 700
            }}>
              {bookingSummary.totalPrice}
            </Typography>
          </Box>
          
          {/* Deposit Chip */}
          <Chip
            label="30% deposit required"
            sx={{
              backgroundColor: Theme['olive-wood'][100],
              color: Theme['olive-wood'][800],
              fontWeight: 500,
              width: '100%'
            }}
          />
          
          <Typography sx={{
            color: Theme['dark-khakhi'][600],
            fontSize: '13px',
            textAlign: 'center'
          }}>
            Full refund if canceled 30+ days before travel
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}