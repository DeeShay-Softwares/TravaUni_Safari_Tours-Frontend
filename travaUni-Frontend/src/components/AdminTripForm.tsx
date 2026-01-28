// src/components/AdminTripForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { FiImage, FiSave, FiX, FiUpload, FiCalendar, FiMapPin } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import type { AdminTripFormProps, Trip } from '../types';
import { colors } from '../assets/constants/Theme';

/**
 * AdminTripForm Component - Form for creating/editing trips
 */
const AdminTripForm: React.FC<AdminTripFormProps> = ({ trip, onSubmit, onCancel }) => {
  /**
   * Initial form state for a new trip
   */
  const initialFormState: Trip = {
    id: '',
    title: '',
    duration: 3,
    price: 0,
    startDate: '',
    endDate: '',
    rating: 4.5,
    image: '',
    description: '',
    location: '',
    reviewCount: 0,
  };

  // Form state management
  const [formData, setFormData] = useState<Trip>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Initialize form with trip data if editing
   */
  useEffect(() => {
    if (trip) {
      setFormData(trip);
    } else {
      // Set default dates for new trip (next month)
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      
      setFormData({
        ...initialFormState,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0],
        id: Date.now().toString()
      });
    }
  }, [trip]);

  /**
   * Validates form fields
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.duration < 1) newErrors.duration = 'Duration must be at least 1 day';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form field changes
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' || name === 'reviewCount' 
        ? parseFloat(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handles select changes
   */
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  /**
   * Handles rating change
   */
  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setFormData(prev => ({
        ...prev,
        rating: newValue
      }));
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      if (!trip) {
        setFormData(initialFormState);
      }
    }
  };

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${colors.darkKhakhi[200]}`,
        maxWidth: 800,
        mx: 'auto'
      }}
    >
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        fontWeight={700}
        sx={{ color: colors.darkKhakhi[900] }}
      >
        {trip ? 'Edit Trip' : 'Upload New Trip'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Trip Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trip Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              placeholder="e.g., Bali Tour Package"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Duration and Price */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Duration (Days)</InputLabel>
              <Select
                name="duration"
                value={formData.duration.toString()}
                label="Duration (Days)"
                onChange={handleSelectChange}
                error={!!errors.duration}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((days) => (
                  <MenuItem key={days} value={days}>
                    {days} {days === 1 ? 'Day' : 'Days'}
                  </MenuItem>
                ))}
              </Select>
              {errors.duration && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.duration}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price (USD)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputProps: { min: 0, step: 1 },
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiCalendar />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiCalendar />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Location */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
              required
              placeholder="e.g., Bali, Indonesia"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMapPin />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Image URL */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              error={!!errors.image}
              helperText={errors.image || 'Use high-quality images (minimum 800x600px)'}
              required
              placeholder="https://example.com/trip-image.jpg"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiImage />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            {formData.image && (
              <Box sx={{ mt: 2, borderRadius: 2, overflow: 'hidden' }}>
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=Invalid+Image+URL';
                  }}
                />
              </Box>
            )}
          </Grid>

          {/* Rating */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                precision={0.1}
                onChange={handleRatingChange}
                icon={<AiFillStar style={{ color: colors.wheat[500] }} />}
                emptyIcon={<AiFillStar style={{ color: colors.darkKhakhi[300] }} />}
              />
              <Typography>{formData.rating.toFixed(1)}</Typography>
            </Box>
          </Grid>

          {/* Review Count */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Review Count"
              name="reviewCount"
              type="number"
              value={formData.reviewCount}
              onChange={handleChange}
              InputProps={{
                inputProps: { min: 0 },
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
              multiline
              rows={4}
              placeholder="Describe the trip package..."
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
              <Button
                onClick={onCancel}
                variant="outlined"
                startIcon={<FiX />}
                sx={{
                  borderRadius: 2,
                  borderColor: colors.darkKhakhi[300],
                  color: colors.darkKhakhi[700],
                  '&:hover': {
                    borderColor: colors.darkKhakhi[400],
                    backgroundColor: colors.darkKhakhi[50]
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={trip ? <FiSave /> : <FiUpload />}
                sx={{
                  borderRadius: 2,
                  backgroundColor: colors.oliveWood[500],
                  '&:hover': {
                    backgroundColor: colors.oliveWood[600],
                  }
                }}
              >
                {trip ? 'Update Trip' : 'Upload Trip'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AdminTripForm;