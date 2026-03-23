// src/components/AdminTripCard.tsx
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Divider
} from '@mui/material';
import { FiCalendar, FiEdit, FiTrash2, FiEye, FiMapPin } from 'react-icons/fi';
import type { TripInput } from '../types';
import { colors } from '../assets/constants/theme';
import AdminTripForm from './AdminTripForm';

interface AdminTripCardProps {
  trip: TripInput;
  onDelete: (trip: TripInput) => void;
  onPreview: (trip: TripInput) => void;
  onTripUpdated: () => void;
}

const AdminTripCard: React.FC<AdminTripCardProps> = ({ 
  trip, 
  onDelete, 
  onPreview,
  onTripUpdated 
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    setEditModalOpen(false);
    onTripUpdated();
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Card 
        sx={{ 
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: colors.darkKhakhi[200],
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        {/* Image at the top */}
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={trip.image || 'https://via.placeholder.com/400x200'}
            alt={trip.title}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: colors.darkKhakhi[700],
                '&:hover': {
                  backgroundColor: 'white',
                }
              }}
            >
              <FiEye size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleEdit}
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#3b82f6',
                }
              }}
            >
              <FiEdit size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(trip)}
              sx={{
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#ef4444',
                }
              }}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* Content Section */}
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              mb: 1,
              color: colors.darkKhakhi[900],
              lineHeight: 1.3,
              height: '3.5rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {trip.title}
          </Typography>

          {/* Location with icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FiMapPin style={{ fontSize: 14, marginRight: 6, color: colors.oliveWood[500] }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.darkKhakhi[600],
                fontWeight: 500
              }}
            >
              {trip.location}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Date Range */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FiCalendar style={{ fontSize: 14, marginRight: 6, color: colors.oliveWood[500] }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.darkKhakhi[700],
                fontWeight: 500
              }}
            >
              {formatDateRange(trip.startDate, trip.endDate)}
            </Typography>
          </Box>

          {/* Price */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.5rem',
                color: colors.oliveWood[600]
              }}
            >
              {formatPrice(trip.price)}
            </Typography>
            
            <Chip
              label={trip.location.split(',')[0]} // First part of location as tag
              size="small"
              sx={{
                backgroundColor: colors.oliveWood[100],
                color: colors.oliveWood[800],
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
          </Box>

          {/* Description preview */}
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              color: colors.darkKhakhi[600],
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            {trip.description}
          </Typography>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog 
        open={editModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          }
        }}
      >
        <DialogContent sx={{ p: 3  }}>
          <AdminTripForm
          formMode='edit'
            trip={trip}
            onCancel={handleCloseModal}
            onSuccess={handleUpdateSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTripCard;