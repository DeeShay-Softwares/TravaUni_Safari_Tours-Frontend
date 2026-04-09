// pages/admin/tabs/UpdatesTab.tsx
import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import UpdateUploadForm from '@/components/UpdateUploadForm';
import { colors } from '@/assets/constants/theme';
import type { TripInput, TripUpdate } from '@/types';

interface UpdatesTabProps {
  trips:       TripInput[];
  tripUpdates: TripUpdate[];
  onAddUpdate: (update: Omit<TripUpdate, 'id' | 'date'>) => void;
}

export const UpdatesTab: React.FC<UpdatesTabProps> = ({ trips, tripUpdates, onAddUpdate }) => (
  <Box>
    <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Trip Updates &amp; Announcements
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Send updates to trip participants via email and WhatsApp
      </Typography>
    </Paper>

    <UpdateUploadForm trips={trips} selectedTrip={null} onSubmit={onAddUpdate} />

    {/* Recent updates list */}
    <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Recent Updates
      </Typography>

      {tripUpdates.length === 0 && (
        <Typography color="text.secondary">No updates sent yet.</Typography>
      )}

      {tripUpdates.slice(0, 5).map((update) => {
        const trip = trips.find((t) => t.title === update.tripId);
        return (
          <Box
            key={update.id}
            sx={{
              p:           2,
              mb:          2,
              borderRadius: 2,
              border:      `1px solid ${colors.oliveWood[200]}`,
              bgcolor:     update.important ? colors.wheat[50] : 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography fontWeight={600}>{update.title}</Typography>
              <Chip label={trip?.title || 'Unknown Trip'} size="small" variant="outlined" />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {update.content}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {new Date(update.date).toLocaleDateString()}
              </Typography>
              <Chip
                label={`Sent via ${update.sentTo}`}
                size="small"
                icon={update.sentTo.includes('whatsapp') ? <FaWhatsapp /> : <FiMail />}
              />
            </Box>
          </Box>
        );
      })}
    </Paper>
  </Box>
);