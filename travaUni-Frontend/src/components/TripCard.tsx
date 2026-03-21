// src/components/TripCard.tsx (Public version - no edit/delete)
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
 
} from '@mui/material';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
//import { AiFillStar } from 'react-icons/ai';
import type { TripCardProps } from '../types';
import { colors } from '@/assets/constants/theme';

const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date: Date): string => {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();
      return `${day} ${month}`;
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const formatPrice = (price: number): string => {
    return `$${price}`;
  };

  const glassEffect = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '420px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        },
        ...glassEffect
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${trip.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))',
          }
        }}
      />
      
      <CardContent sx={{ 
        height: '100%', 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900,
                fontSize: '32px',
                lineHeight: 1,
                color: colors.wheat[100],
                mb: 0.5
              }}
            >
             <FiMapPin size={35}/>
            </Typography>
            
            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AiFillStar style={{ color: colors.wheat[400], fontSize: 18 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '16px',
                  color: colors.wheat[200]
                }}
              >
                {trip.rating}
              </Typography>
            </Box> */}
          </Box>
        </Box>

        <Box 
          sx={{ 
            width: '100%', 
            height: '2px', 
            background: `linear-gradient(90deg, transparent, ${colors.wheat[400]}, transparent)`,
            my: 2,
            opacity: 0.5
          }} 
        />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FiCalendar style={{ fontSize: 18, marginRight: 8, color: colors.wheat[300] }} />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              fontSize: '15px',
              letterSpacing: '0.5px',
              color: colors.wheat[200]
            }}
          >
            {formatDateRange(trip.startDate, trip.endDate)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontSize: '22px',
              lineHeight: 1.3,
              mb: 1,
              color: 'white'
            }}
          >
            {trip.title}
          </Typography>
          
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              fontSize: '28px',
              lineHeight: 1,
              color: colors.wheat[400]
            }}
          >
            {formatPrice(trip.price)}
          </Typography>
        </Box>

        {trip.location && (
          <Chip
            label={trip.location}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 500,
              fontSize: '12px',
              alignSelf: 'flex-start'
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TripCard;