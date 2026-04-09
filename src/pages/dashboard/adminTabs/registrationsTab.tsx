import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import RegistrationsTable        from '@/components/RegistrationsTable';
import RegistrationDetailsModal  from '@/components/RegistrationDetailsModal';
import BookingServices           from '@/ApiCalls/BookingApi';
import type { BookingResponse }  from '@/ApiCalls/BookingApi';
import type { TripInput, Registration, SnackbarState } from '@/types';
import type { TravelerResponse } from '@/ApiCalls/travelerApi';
import { getErrorMessage, isUnauthorizedError } from '@/lib/utils';

interface RegistrationsTabProps {
  trips:        TripInput[];
  showSnackbar: (msg: string, sev: SnackbarState['severity']) => void;
}

// ── Map BookingResponse → Registration ────────────────────────────────────────

function bookingToRegistration(b: BookingResponse): Registration {
  const main = b.mainTravelerId as TravelerResponse;

  return {
    id:               b._id,
    bookingId:        b.bookingNumber,
    tripId:           typeof b.tripId === 'object' ? b.tripId._id   : b.tripId,
    tripTitle:        typeof b.tripId === 'object' ? b.tripId.title : '',

    status:           b.status as Registration['status'],

    paymentStatus:    b.paymentStatus === 'completed'
                        ? 'paid'
                        : (b.paymentStatus as Registration['paymentStatus']),
    paymentAmount:    b.totalPrice,
    paymentProof:     '',

    registrationDate: b.bookingDate ?? b.createdAt,

    fullName:         main?.fullName    ?? '—',
    email:            b.contactEmail,
    phoneNumber:      b.contactPhone,
    age:              main?.age         ? parseInt(main.age, 10) : 0,
    gender:           main?.gender      ?? '',
    nationality:      main?.nationality ?? '—',
    isStudent:        main?.isStudent   ?? false,
    university:       main?.schoolName  ?? '',
    studentId:        '',

    emergencyContact:     { name: '', phone: '', relationship: '' },
    medicalConditions:    '',
    dietaryRestrictions:  '',

    whatsappNumber:        b.contactPhone,
    preferredContact:      'email',
    confirmationEmailSent: b.status === 'confirmed',
    whatsappGroupAdded:    false,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export const RegistrationsTab: React.FC<RegistrationsTabProps> = ({
  showSnackbar,
}) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading,        setLoading]       = useState(true);
  const [selectedReg,    setSelectedReg]   = useState<Registration | null>(null);

  const showSnackbarRef = useRef(showSnackbar);
  useEffect(() => { showSnackbarRef.current = showSnackbar; }, [showSnackbar]);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await BookingServices.getAllBookings({ page: 1, limit: 25 });
      setRegistrations(result.data.map(bookingToRegistration));
    } catch (err) {
      if (!isUnauthorizedError(err)) {
        showSnackbarRef.current('Failed to load registrations', 'error');
        getErrorMessage(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // ── Confirm booking ───────────────────────────────────────────────────────

  const handleConfirm = async (registrationId: string) => {
    try {
      await BookingServices.confirmBooking(registrationId);
      showSnackbarRef.current(
        'Booking confirmed — confirmation email sent to traveler',
        'success',
      );
      fetchRegistrations();
    } catch (err) {
      if (!isUnauthorizedError(err)) {
        showSnackbarRef.current('Failed to confirm booking', 'error');
        getErrorMessage(err);
      }
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Registration Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View, confirm, and manage trip registrations
        </Typography>
      </Paper>

      {/* Loading / Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RegistrationsTable
          registrations={registrations}
          onConfirm={handleConfirm}
          onViewDetails={(reg) => setSelectedReg(reg)}
        />
      )}

      {/* Details modal */}
      <RegistrationDetailsModal
        registration={selectedReg}
        open={selectedReg !== null}
        onClose={() => setSelectedReg(null)}
        onConfirm={() => {
          showSnackbarRef.current(
            'Booking confirmed — confirmation email sent to traveler',
            'success',
          );
          setSelectedReg(null);
          fetchRegistrations();
        }}
      />
    </Box>
  );
};