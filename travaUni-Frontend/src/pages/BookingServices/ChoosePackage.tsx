// PackageSelection.tsx - Step 2 with CSS Grid
import { Box, Typography, Card, CardContent, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FaCrown, FaStar, FaGem } from 'react-icons/fa6';
import { Theme } from '@/assets/constants/colors';
import { useState } from 'react';

const packages = [
  {
    id: 'basic',
    name: "Basic Safari",
    icon: FaStar,
    price: "$1,800",
    features: [
      "Shared accommodations",
      "Group game drives",
      "Breakfast & dinner included",
      "Park entrance fees",
      "Professional guide"
    ],
    color: Theme.wheat[600]
  },
  {
    id: 'premium',
    name: "Premium Safari",
    icon: FaCrown,
    price: "$2,800",
    features: [
      "Private lodge accommodations",
      "Private game drives",
      "All meals included",
      "Park entrance fees",
      "Personal guide & tracker",
      "Sundowner cocktails"
    ],
    color: Theme.bronze[600]
  },
  {
    id: 'luxury',
    name: "Luxury Safari",
    icon: FaGem,
    price: "$4,500",
    features: [
      "5-star lodge accommodations",
      "Exclusive game drives",
      "Gourmet dining",
      "All park fees included",
      "Personal butler service",
      "Hot air balloon safari",
      "Spa treatments"
    ],
    color: Theme['olive-wood'][600]
  }
];

export default function PackageSelection() {
  const [selectedPackage, setSelectedPackage] = useState('premium');

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
        Select Your Safari Package
      </Typography>
      
      <Typography sx={{
        color: Theme['dark-khakhi'][600],
        fontSize: '16px'
      }}>
        Choose the experience level that matches your safari dreams
      </Typography>

      {/* Packages Grid */}
      <RadioGroup
        value={selectedPackage}
        onChange={(e) => setSelectedPackage(e.target.value)}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 3,
          alignContent: 'start'
        }}>
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackage === pkg.id;
            
            return (
              <FormControlLabel
                key={pkg.id}
                value={pkg.id}
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <Card sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: isSelected ? `3px solid ${pkg.color}` : '1px solid #e0e0e0',
                    backgroundColor: isSelected ? `${pkg.color}10` : 'white',
                    display: 'grid',
                    gridTemplateRows: 'auto auto 1fr auto',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}>
                    <CardContent sx={{
                      p: 3,
                      display: 'grid',
                      gridTemplateRows: 'auto auto 1fr auto',
                      gap: 2,
                      height: '100%'
                    }}>
                      {/* Price & Icon */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        gap: 2,
                        alignItems: 'center',
                        justifyItems: 'center'
                      }}>
                        <Box sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          backgroundColor: `${pkg.color}20`,
                          display: 'grid',
                          placeItems: 'center'
                        }}>
                          <Icon size={24} color={pkg.color} />
                        </Box>
                        <Typography variant="h5" sx={{
                          fontWeight: 700,
                          color: pkg.color,
                          justifySelf: 'start'
                        }}>
                          {pkg.price}
                        </Typography>
                      </Box>
                      
                      {/* Package Name */}
                      <Typography variant="h6" sx={{
                        fontWeight: 600,
                        color: Theme['dark-khakhi'][800],
                        textAlign: 'center'
                      }}>
                        {pkg.name}
                      </Typography>
                      
                      {/* Features */}
                      <Box sx={{
                        display: 'grid',
                        gridTemplateRows: `repeat(${pkg.features.length}, auto)`,
                        gap: 1
                      }}>
                        {pkg.features.map((feature, idx) => (
                          <Typography key={idx} sx={{
                            color: Theme['dark-khakhi'][600],
                            fontSize: '14px',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr',
                            gap: 1,
                            alignItems: 'center'
                          }}>
                            <Box sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: pkg.color
                            }} />
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                      
                      {/* Selected Indicator */}
                      {isSelected && (
                        <Typography sx={{
                          color: pkg.color,
                          fontWeight: 600,
                          fontSize: '14px',
                          textAlign: 'center',
                          mt: 2
                        }}>
                          Selected Package
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                }
                sx={{ width: '100%', m: 0 }}
              />
            );
          })}
        </Box>
      </RadioGroup>
    </Box>
  );
}