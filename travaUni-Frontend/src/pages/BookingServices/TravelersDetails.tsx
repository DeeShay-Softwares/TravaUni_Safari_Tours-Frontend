// TravelerDetails.tsx - Step 3 with CSS Grid (Refined with correct theme usage)
import { Box, Typography, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { FaUser, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa6';
import { Theme } from '@/assets/constants/colors';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function TravelerDetails() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelMonth: '',
    travelYear: '',
    travelers: '2',
    specialRequests: ''
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to display selected date
  const getDisplayDate = () => {
    if (formData.travelMonth && formData.travelYear) {
      const monthIndex = parseInt(formData.travelMonth) - 1;
      return `${months[monthIndex]} ${formData.travelYear}`;
    }
    return 'Not selected';
  };

  // Get season recommendation based on month
  const getSeasonRecommendation = () => {
    if (!formData.travelMonth) return '';
    
    const month = parseInt(formData.travelMonth);
    if (month >= 6 && month <= 10) {
      return '🌞 Perfect for wildlife viewing! Best time for safari.';
    } else if (month >= 3 && month <= 5) {
      return '🌧️ Green season - lush landscapes, fewer crowds, occasional showers.';
    } else {
      return '🌤️ Good time to visit with comfortable temperatures.';
    }
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'grid',
      gridTemplateRows: 'auto auto 1fr auto',
      gap: 3,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Header */}
      <Typography variant="h4" sx={{
        color: Theme.bronze[700],
        fontWeight: 600,
        fontFamily: 'inherit'
      }}>
        Traveler Information
      </Typography>
      
      <Typography sx={{
        color: Theme['dark-khakhi'][600],
        fontSize: '16px',
        fontFamily: 'inherit'
      }}>
        Please provide your details for booking confirmation
      </Typography>

      {/* Form Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(12, 1fr)' },
        gap: 3,
        alignContent: 'start'
      }}>
        {/* Full Name - spans 6 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            InputProps={{
              startAdornment: <FaUser style={{ marginRight: 10, color: Theme.bronze[500] }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: Theme['olive-wood'][400],
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}
          />
        </Box>
        
        {/* Email - spans 6 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            InputProps={{
              startAdornment: <FaEnvelope style={{ marginRight: 10, color: Theme.bronze[500] }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: Theme['olive-wood'][400],
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}
          />
        </Box>
        
        {/* Phone - spans 6 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            InputProps={{
              startAdornment: <FaPhone style={{ marginRight: 10, color: Theme.bronze[500] }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: Theme['olive-wood'][400],
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}
          />
        </Box>
        
        {/* Travelers - spans 6 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 6' } }}>
          <FormControl fullWidth>
            <InputLabel sx={{
              color: Theme['dark-khakhi'][600],
              '&.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}>
              Number of Travelers
            </InputLabel>
            <Select
              value={formData.travelers}
              label="Number of Travelers"
              onChange={(e) => handleChange('travelers', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['dark-khakhi'][300],
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][400],
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][500],
                }
              }}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <MenuItem 
                  key={num} 
                  value={num.toString()}
                  sx={{
                    '&:hover': {
                      backgroundColor: Theme.wheat[100],
                    },
                    '&.Mui-selected': {
                      backgroundColor: Theme['olive-wood'][50],
                      '&:hover': {
                        backgroundColor: Theme['olive-wood'][100],
                      }
                    }
                  }}
                >
                  {num} {num === 1 ? 'Traveler' : 'Travelers'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Travel Month - spans 3 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 6', md: 'span 3' } }}>
          <FormControl fullWidth>
            <InputLabel sx={{
              color: Theme['dark-khakhi'][600],
              '&.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}>
              Travel Month
            </InputLabel>
            <Select
              value={formData.travelMonth}
              label="Travel Month"
              onChange={(e) => handleChange('travelMonth', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['dark-khakhi'][300],
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][400],
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][500],
                }
              }}
            >
              <MenuItem value="">
                <em>Select month</em>
              </MenuItem>
              {months.map((month, index) => (
                <MenuItem 
                  key={month} 
                  value={(index + 1).toString()}
                  sx={{
                    '&:hover': {
                      backgroundColor: Theme.wheat[100],
                    },
                    '&.Mui-selected': {
                      backgroundColor: Theme['olive-wood'][50],
                      '&:hover': {
                        backgroundColor: Theme['olive-wood'][100],
                      }
                    }
                  }}
                >
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        {/* Travel Year - spans 3 columns on desktop */}
        <Box sx={{ gridColumn: { xs: 'span 6', md: 'span 3' } }}>
          <FormControl fullWidth>
            <InputLabel sx={{
              color: Theme['dark-khakhi'][600],
              '&.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}>
              Travel Year
            </InputLabel>
            <Select
              value={formData.travelYear}
              label="Travel Year"
              onChange={(e) => handleChange('travelYear', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['dark-khakhi'][300],
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][400],
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: Theme['olive-wood'][500],
                }
              }}
            >
              <MenuItem value="">
                <em>Select year</em>
              </MenuItem>
              {years.map(year => (
                <MenuItem 
                  key={year} 
                  value={year.toString()}
                  sx={{
                    '&:hover': {
                      backgroundColor: Theme.wheat[100],
                    },
                    '&.Mui-selected': {
                      backgroundColor: Theme['olive-wood'][50],
                      '&:hover': {
                        backgroundColor: Theme['olive-wood'][100],
                      }
                    }
                  }}
                >
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Date Input Field - Alternative option */}
        <Box sx={{ 
          gridColumn: { xs: 'span 12', md: 'span 6' },
          display: 'grid',
          gridTemplateColumns: '1fr'
        }}>
          <TextField
            fullWidth
            label="Or enter specific date"
            type="date"
            value={formData.travelMonth && formData.travelYear ? 
              `${formData.travelYear}-${formData.travelMonth.padStart(2, '0')}-01` : ''}
            onChange={(e) => {
              const date = new Date(e.target.value);
              if (!isNaN(date.getTime())) {
                handleChange('travelMonth', (date.getMonth() + 1).toString());
                handleChange('travelYear', date.getFullYear().toString());
              }
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: <FaCalendar style={{ marginRight: 10, color: Theme.bronze[500] }} />
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: Theme['olive-wood'][400],
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}
          />
        </Box>
        
        {/* Special Requests - spans full width */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Special Requests or Requirements"
            value={formData.specialRequests}
            onChange={(e) => handleChange('specialRequests', e.target.value)}
            placeholder="Any dietary restrictions, accessibility needs, or special celebrations?"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: Theme['olive-wood'][400],
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: Theme['olive-wood'][500],
              }
            }}
          />
        </Box>
      </Box>

      {/* Selected Date Display */}
      {(formData.travelMonth || formData.travelYear) && (
        <Box sx={{
          p: 2,
          backgroundColor: Theme['olive-wood'][50],
          borderRadius: 2,
          border: `1px solid ${Theme['olive-wood'][200]}`,
          gridColumn: 'span 12',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center'
        }}>
          <FaCalendar style={{ color: Theme['olive-wood'][600] }} />
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 0.5
          }}>
            <Typography sx={{
              color: Theme['olive-wood'][800],
              fontSize: '14px',
              fontWeight: 500
            }}>
              Selected Travel Period: {getDisplayDate()}
            </Typography>
            <Typography sx={{
              color: Theme['dark-khakhi'][600],
              fontSize: '13px'
            }}>
              {getSeasonRecommendation()}
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Note Section */}
      <Box sx={{
        gridColumn: 'span 12',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 3
      }}>
        {/* Booking Info */}
        <Box sx={{
          p: 2,
          backgroundColor: Theme.wheat[50],
          borderRadius: 2,
          borderLeft: `4px solid ${Theme.bronze[500]}`,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: Theme.bronze[100],
            display: 'grid',
            placeItems: 'center'
          }}>
            <FaInfoCircle size={12} color={Theme.bronze[600]} />
          </Box>
          <Box>
            <Typography sx={{
              color: Theme['dark-khakhi'][700],
              fontSize: '13px',
              fontWeight: 500,
              mb: 0.5
            }}>
              Booking Process
            </Typography>
            <Typography sx={{
              color: Theme['dark-khakhi'][600],
              fontSize: '12px'
            }}>
              Confirmation within 24 hours • 30% deposit required • Flexible cancellation
            </Typography>
          </Box>
        </Box>

        {/* Best Time Info */}
        <Box sx={{
          p: 2,
          backgroundColor: Theme['olive-wood'][50],
          borderRadius: 2,
          borderLeft: `4px solid ${Theme['olive-wood'][500]}`,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center'
        }}>
          <Box sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: Theme['olive-wood'][100],
            display: 'grid',
            placeItems: 'center'
          }}>
            <FaCalendar size={12} color={Theme['olive-wood'][600]} />
          </Box>
          <Box>
            <Typography sx={{
              color: Theme['dark-khakhi'][700],
              fontSize: '13px',
              fontWeight: 500,
              mb: 0.5
            }}>
              Best Safari Times
            </Typography>
            <Typography sx={{
              color: Theme['dark-khakhi'][600],
              fontSize: '12px'
            }}>
              June-Oct: Dry season • Nov-Feb: Mild weather • Mar-May: Green season
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}