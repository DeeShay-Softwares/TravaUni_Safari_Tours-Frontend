// src/components/UpdateUploadForm.tsx
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert
} from '@mui/material';
import { FiUpload, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '../assets/constants/Theme';
import type { Trip } from '../types';

interface UpdateUploadFormProps {
  trips: Trip[];
  selectedTrip?: string | null;
  onSubmit: (update: any) => void;
}

const UpdateUploadForm: React.FC<UpdateUploadFormProps> = ({ trips, selectedTrip, onSubmit }) => {
  const [formData, setFormData] = useState({
    tripId: selectedTrip || '',
    title: '',
    content: '',
    important: false,
    sendToWhatsapp: true,
    sendToEmail: true,
    attachments: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      tripId: formData.tripId,
      title: formData.title,
      content: formData.content,
      important: formData.important,
      sentTo: formData.sendToWhatsapp && formData.sendToEmail 
        ? 'both' 
        : formData.sendToWhatsapp 
        ? 'whatsapp' 
        : 'email'
    };

    onSubmit(updateData);
    
    // Reset form
    setFormData({
      tripId: selectedTrip || '',
      title: '',
      content: '',
      important: false,
      sendToWhatsapp: true,
      sendToEmail: true,
      attachments: []
    });
  };

  const selectedTripDetails = trips.find(t => t.id === formData.tripId);

  return (
    <Paper sx={{ 
      p: 4, 
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
    }}>
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom color={colors.oliveWood[700]}>
          Send Trip Update
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Send important announcements and updates to trip participants
        </Typography>
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Trip Selection - Full width on mobile, half on desktop */}
        <Box sx={{ 
          gridColumn: { xs: '1', md: 'span 2' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
        }}>
          <FormControl sx={{ gridColumn: { xs: '1', md: '1' } }}>
            <InputLabel>Select Trip</InputLabel>
            <Select
              value={formData.tripId}
              onChange={(e) => setFormData(prev => ({ ...prev, tripId: e.target.value }))}
              label="Select Trip"
              required
            >
              <MenuItem value="">All Trips</MenuItem>
              {trips.map(trip => (
                <MenuItem key={trip.id} value={trip.id}>
                  {trip.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Update Title - Next to trip selection on desktop */}
          <TextField
            required
            label="Update Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Important Schedule Change"
            sx={{ gridColumn: { xs: '1', md: '2' } }}
          />
        </Box>

        {/* Show trip details alert below the selection if trip is selected */}
        {selectedTripDetails && (
          <Box sx={{ 
            gridColumn: { xs: '1', md: 'span 2' },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
            gap: 2,
          }}>
            <Alert severity="info" sx={{ width: '100%' }}>
              Update will be sent to participants of: {selectedTripDetails.title}
            </Alert>
          </Box>
        )}

        {/* Update Content - Full width */}
        <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
          <TextField
            fullWidth
            required
            multiline
            rows={4}
            label="Update Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter detailed update information..."
          />
        </Box>

        {/* Options - Full width with grid layout */}
        <Box sx={{ 
          gridColumn: { xs: '1', md: 'span 2' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(250px, 1fr))' },
          gap: 2,
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.important}
                onChange={handleCheckboxChange}
                name="important"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Important" color="warning" size="small" />
                Mark as important update
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sendToWhatsapp}
                onChange={handleCheckboxChange}
                name="sendToWhatsapp"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaWhatsapp color="#25D366" />
                Send to WhatsApp
              </Box>
            }
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sendToEmail}
                onChange={handleCheckboxChange}
                name="sendToEmail"
              />
            }
            label="Send Email Notification"
          />
        </Box>

        {/* Attachments - Full width */}
        <Box sx={{ 
          gridColumn: { xs: '1', md: 'span 2' },
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 2,
          alignItems: 'center',
        }}>
          <Button
            startIcon={<FiUpload />}
            variant="outlined"
            component="label"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Upload Attachment
            <input
              type="file"
              hidden
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log('Files to upload:', files);
              }}
            />
          </Button>
          <Typography variant="caption" color="text.secondary">
            Upload images, documents, or PDFs (optional)
          </Typography>
        </Box>

        {/* Submit Buttons - Full width with flex layout */}
        <Box sx={{ 
          gridColumn: { xs: '1', md: 'span 2' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mt: 1,
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<FiSend />}
              sx={{
                px: 4,
                py: 1.5,
                bgcolor: colors.oliveWood[500],
                '&:hover': { bgcolor: colors.oliveWood[600] },
                whiteSpace: 'nowrap',
              }}
            >
              Publish Update
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            justifyContent: { xs: 'center', md: 'flex-end' }
          }}>
            <Button
              variant="outlined"
              startIcon={<FaWhatsapp />}
              onClick={() => {
                const message = `*${formData.title}*\n\n${formData.content}\n\n_This is an automated update from TravaUni_`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
              }}
              disabled={!formData.title || !formData.content}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Preview WhatsApp
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UpdateUploadForm;