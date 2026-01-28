// src/components/AdminTripCard.tsx
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { FiCalendar, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import  type { Trip } from '../types';
import { colors } from '../assets/constants/Theme';

interface AdminTripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  onPreview: (trip: Trip) => void;
}

/**
 * AdminTripCard Component - Trip card for admin with edit/delete actions
 */
const AdminTripCard: React.FC<AdminTripCardProps> = ({ 
  trip, 
  onEdit, 
  onDelete, 
  onPreview 
}) => {
  /**
   * Formats the date range string from start and end dates
   */
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

  /**
   * Formats price with currency symbol
   */
  const formatPrice = (price: number): string => {
    return `$${price}`;
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '420px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
         backgroundColor: 'transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      {/* Background Image with Overlay */}
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
          zIndex: -2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.73))',
            
          }
        }}
      />

      {/* Admin Actions Overlay */}
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        right: 12, 
        display: 'flex', 
        gap: 1,
        zIndex: 2 
      }}>
        <IconButton
          size="small"
          onClick={() => onPreview(trip)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <FiEye size={16} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onEdit(trip)}
          sx={{
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.3)',
            }
          }}
        >
          <FiEdit size={16} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(trip)}
          sx={{
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
            }
          }}
        >
          <FiTrash2 size={16} />
        </IconButton>
      </Box>

      {/* Content Container */}
      <CardContent sx={{ 
        height: '100%', 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-end',
        color: 'white'
      }}>
        {/* Top Section - Duration & Rating */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                fontSize: '32px',
                lineHeight: 1,
                color: colors.wheat[300],
                mb: 0.5
              }}
            >
              {trip.duration} Days
            </Typography>
            
            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            </Box>
          </Box>
        </Box>

        {/* Divider Line */}
        <Box 
          sx={{ 
            width: '100%', 
            height: '2px', 
            background: `linear-gradient(90deg, transparent, ${colors.wheat[400]}, transparent)`,
            my: 2,
            opacity: 0.5
          }} 
        />

        {/* Dates */}
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

        {/* Title and Price */}
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

        {/* Location and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={trip.location}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: 500,
              fontSize: '12px'
            }}
          />
          
          {/* <Button
            size="small"
            variant="contained"
            onClick={() => onPreview(trip)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '12px',
              py: 0.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Preview
          </Button> */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminTripCard;