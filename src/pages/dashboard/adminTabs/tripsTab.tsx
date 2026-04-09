// pages/admin/tabs/TripsTab.tsx
import React, { useState } from 'react';
import {
  Box, Paper, Typography, Button,
} from '@mui/material';
import { FiPlus, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AdminTripForm from '@/components/AdminTripForm';
import AdminTripCard from '@/components/AdminTripCard';
import DeleteModal from '@/components/DeleteModal';
import TripServices from '@/ApiCalls/TripApi';
import { colors } from '@/assets/constants/theme';
import type { TripInput, SnackbarState } from '@/types';

interface TripsTabProps {
  trips:       TripInput[];
  loading:     boolean;
  onRefresh:   () => void;
  showSnackbar: (msg: string, sev: SnackbarState['severity']) => void;
  onTripClick: (trip: TripInput) => void;
}

export const TripsTab: React.FC<TripsTabProps> = ({
  trips,
  loading,
  onRefresh,
  showSnackbar,
}) => {
  const navigate = useNavigate();

  const [editingTrip,    setEditingTrip]    = useState<TripInput | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete,   setTripToDelete]   = useState<string | null>(null);

  const handleDeleteClick = (title: string) => {
    setTripToDelete(title);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      const response = await TripServices.deleteTrip(tripToDelete);
      if (response?.success === true) {
        onRefresh();
        showSnackbar('Trip deleted successfully', 'success');
      } else {
        showSnackbar(response?.message || 'Failed to delete trip', 'error');
      }
    } catch {
      showSnackbar('Error deleting trip. Please try again.', 'error');
    } finally {
      setDeleteModalOpen(false);
      setTripToDelete(null);
    }
  };

  // ── Creating / editing form view ──────────────────────────────────────────
  if (editingTrip) {
    return (
      <Box>
        <Button
          variant="outlined"
          onClick={() => setEditingTrip(null)}
          startIcon={<FiHome />}
          sx={{ mb: 3 }}
        >
          Back to Trips
        </Button>
        <AdminTripForm
          formMode="create"
          trip={editingTrip}
          onCancel={() => setEditingTrip(null)}
          onSuccess={() => { setEditingTrip(null); onRefresh(); }}
        />
      </Box>
    );
  }

  if (loading) return <Typography>Loading trips…</Typography>;

  return (
    <>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>Trip Management</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload, edit, and manage travel packages
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => setEditingTrip({ title: '', price: 0, startDate: '', endDate: '', image: '', description: '', location: '' })}
            sx={{ bgcolor: colors.oliveWood[500] }}
          >
            Upload Trip
          </Button>
        </Box>
      </Paper>

      {/* Empty state */}
      {trips.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No trips uploaded yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<FiPlus />}
            onClick={() => setEditingTrip({ title: '', price: 0, startDate: '', endDate: '', image: '', description: '', location: '' })}
            sx={{ mt: 2, bgcolor: colors.oliveWood[500], '&:hover': { bgcolor: colors.oliveWood[600] } }}
          >
            Upload Your First Trip
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display:             'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
            gap:                 4,
          }}
        >
          {trips.map((trip) => (
            <AdminTripCard
              key={trip.title}
              trip={trip}
              onDelete={() => handleDeleteClick(trip.title)}
              onPreview={() => navigate(`/admin/trips/${encodeURIComponent(trip.title)}`)}
              onTripUpdated={onRefresh}
            />
          ))}
        </Box>
      )}

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setTripToDelete(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This cannot be undone."
      />
    </>
  );
};