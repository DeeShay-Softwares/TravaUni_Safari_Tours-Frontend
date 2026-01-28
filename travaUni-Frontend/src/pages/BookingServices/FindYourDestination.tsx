// DestinationSelection.tsx - Step 1 with CSS Grid
import { Box, Typography, Card, CardContent } from '@mui/material';
import { FaMountain, FaWater, FaTree, FaMountainSun } from 'react-icons/fa6';
import { Theme } from '@/assets/constants/colors';
import { useState } from 'react';

const destinations = [
  {
    id: 1,
    name: "Serengeti National Park",
    icon: FaTree,
    description: "Witness the Great Migration and Big Five",
    duration: "5-7 days",
    price: "$2,500",
    color: Theme['olive-wood'][500]
  },
  {
    id: 2,
    name: "Maasai Mara",
    icon: FaMountainSun,
    description: "Kenya's premier wildlife destination",
    duration: "4-6 days",
    price: "$2,200",
    color: Theme.bronze[500]
  },
  {
    id: 3,
    name: "Okavango Delta",
    icon: FaWater,
    description: "Unique water-based safari experience",
    duration: "6-8 days",
    price: "$3,000",
    color: Theme.wheat[600]
  },
  {
    id: 4,
    name: "Kruger National Park",
    icon: FaMountain,
    description: "South Africa's flagship park",
    duration: "5-7 days",
    price: "$2,800",
    color: Theme['dark-khakhi'][600]
  }
];

export default function DestinationSelection() {
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null);

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
        Choose Your Destination
      </Typography>
      
      <Typography sx={{
        color: Theme['dark-khakhi'][600],
        fontSize: '16px'
      }}>
        Select your preferred safari destination
      </Typography>

      {/* Destinations Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        alignContent: 'start'
      }}>
        {destinations.map((dest) => {
          const Icon = dest.icon;
          const isSelected = selectedDestination === dest.id;
          
          return (
            <Card
              key={dest.id}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: isSelected ? `3px solid ${dest.color}` : '3px solid transparent',
                transform: isSelected ? 'translateY(-5px)' : 'none',
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
              onClick={() => setSelectedDestination(dest.id)}
            >
              <CardContent sx={{
                p: 3,
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr auto',
                gap: 2,
                height: '100%'
              }}>
                {/* Icon */}
                <Box sx={{
                  justifySelf: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: `${dest.color}20`,
                  display: 'grid',
                  placeItems: 'center'
                }}>
                  <Icon size={28} color={dest.color} />
                </Box>
                
                {/* Title */}
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: Theme['dark-khakhi'][800],
                  textAlign: 'center'
                }}>
                  {dest.name}
                </Typography>
                
                {/* Description */}
                <Typography sx={{
                  color: Theme['dark-khakhi'][600],
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {dest.description}
                </Typography>
                
                {/* Footer */}
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  alignItems: 'center',
                  mt: 'auto'
                }}>
                  <Typography sx={{
                    color: Theme.bronze[600],
                    fontWeight: 500,
                    fontSize: '14px',
                    justifySelf: 'start'
                  }}>
                    {dest.duration}
                  </Typography>
                  <Typography sx={{
                    color: Theme.bronze[700],
                    fontWeight: 700,
                    fontSize: '16px',
                    justifySelf: 'end'
                  }}>
                    {dest.price}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Selected Destination Info */}
      {selectedDestination && (
        <Box sx={{
          mt: 'auto',
          pt: 3,
          borderTop: `1px solid ${Theme.bronze[200]}`,
          display: 'grid',
          placeItems: 'center'
        }}>
          <Typography sx={{
            color: Theme.bronze[600],
            fontWeight: 500
          }}>
            Selected: {destinations.find(d => d.id === selectedDestination)?.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
}