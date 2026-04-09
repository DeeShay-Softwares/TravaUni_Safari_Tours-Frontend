// pages/admin/TripPreviewPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Paper, Typography, Button, Chip, Avatar, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, IconButton, Tooltip,
} from '@mui/material';
import { FiArrowLeft, FiCheckCircle, FiCalendar, FiMapPin, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import BookingServices from '@/ApiCalls/BookingApi';
import TripServices    from '@/ApiCalls/TripApi';
import { colors } from '@/assets/constants/theme';
import type { BookingResponse } from '@/ApiCalls/BookingApi';
import type { TripInput } from '@/types';
import type { TravelerResponse } from '@/ApiCalls/travelerApi';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

const formatPrice = (p: number) =>
  new Intl.NumberFormat('en-ZM', {
    style: 'currency', currency: 'ZMW', currencyDisplay: 'symbol', minimumFractionDigits: 0,
  }).format(p);

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: '#dcfce7', color: '#15803d' },
  pending:   { bg: '#fef9c3', color: '#854d0e' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
  completed: { bg: '#dbeafe', color: '#1d4ed8' },
};

const PAYMENT_COLORS: Record<string, { bg: string; color: string }> = {
  completed: { bg: '#dcfce7', color: '#15803d' },
  partial:   { bg: '#fef9c3', color: '#854d0e' },
  pending:   { bg: '#fee2e2', color: '#b91c1c' },
  refunded:  { bg: '#f3e8ff', color: '#7e22ce' },
};

// ── Component ─────────────────────────────────────────────────────────────────

const TripPreviewPage: React.FC = () => {
  const { tripTitle } = useParams<{ tripTitle: string }>();
  const navigate      = useNavigate();

  const [trip,      setTrip]      = useState<TripInput | null>(null);
  const [bookings,  setBookings]  = useState<BookingResponse[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  const decodedTitle = tripTitle ? decodeURIComponent(tripTitle) : '';

  const fetchData = useCallback(async () => {
    if (!decodedTitle) return;
    setLoading(true);
    try {
      const [tripsRes, bookingsRes] = await Promise.all([
        TripServices.getAllTrips(),
        // Use tripTitle filter — the backend looks up the Trip ObjectId from
        // the title and filters bookings by that ObjectId.
        // Using `search` was wrong — it only matches bookingNumber/contactEmail.
        BookingServices.getAllBookings({ tripTitle: decodedTitle, limit: 100 }),
      ]);

      const found = tripsRes.data.data.find(
        (t: TripInput) => t.title === decodedTitle,
      );
      setTrip(found ?? null);

      // Backend already filtered by tripTitle — no client-side re-filter needed
      setBookings(bookingsRes.data);
    } catch {
      setError('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  }, [decodedTitle]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirm = async (bookingId: string) => {
    setConfirming(bookingId);
    try {
      await BookingServices.confirmBooking(bookingId);
      await fetchData(); // refresh booking list
    } catch {
      setError('Failed to confirm booking');
    } finally {
      setConfirming(null);
    }
  };

  // ── Derived stats ─────────────────────────────────────────────────────────
  const totalTravelers = bookings.reduce(
    (sum, b) => sum + 1 + (b.additionalTravelerIds?.length ?? 0),
    0,
  );
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount   = bookings.filter((b) => b.status === 'pending').length;
  const totalRevenue   = bookings.reduce((sum, b) => sum + (b.totalPrice ?? 0), 0);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!trip) {
    return (
      <Box sx={{ p: 4 }}>
        <Button startIcon={<FiArrowLeft />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography>Trip not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Back button */}
      <Button
        startIcon={<FiArrowLeft />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, color: colors.darkKhakhi[700] }}
      >
        Back to Trips
      </Button>

      {/* Trip hero card */}
      <Paper
        sx={{
          mb:           4,
          borderRadius: 3,
          overflow:     'hidden',
          boxShadow:    '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {/* Banner image */}
        {trip.image && (
          <Box
            component="img"
            src={trip.image}
            alt={trip.title}
            sx={{ width: '100%', height: 280, objectFit: 'cover' }}
          />
        )}

        <Box sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: colors.darkKhakhi[900], mb: 1 }}>
            {trip.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <FiMapPin size={15} color={colors.oliveWood[500]} />
              <Typography variant="body2" color="text.secondary">{trip.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <FiCalendar size={15} color={colors.oliveWood[500]} />
              <Typography variant="body2" color="text.secondary">
                {fmt(trip.startDate)} — {fmt(trip.endDate)}
              </Typography>
            </Box>
          </Box>

          {trip.description && (
            <Typography variant="body1" sx={{ color: colors.darkKhakhi[600], lineHeight: 1.7 }}>
              {trip.description}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Quick stats */}
          <Box
            sx={{
              display:             'grid',
              gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' },
              gap:                 2,
            }}
          >
            {[
              { label: 'Total Bookings',  value: bookings.length,    icon: <FiUsers />,     color: colors.oliveWood[500] },
              { label: 'Total Travelers', value: totalTravelers,      icon: <FiUsers />,     color: colors.bronze[500]    },
              { label: 'Confirmed',       value: confirmedCount,      icon: <FiCheckCircle />, color: '#15803d'            },
              { label: 'Revenue',         value: formatPrice(totalRevenue), icon: <FiDollarSign />, color: '#25D366'       },
            ].map((s) => (
              <Box
                key={s.label}
                sx={{
                  p:            2,
                  borderRadius: 2,
                  bgcolor:      colors.wheat[50],
                  border:       `1px solid ${colors.bronze[100]}`,
                  textAlign:    'center',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                    {React.cloneElement(s.icon as React.ReactElement<{ size: number; color: string }>, { 
  size: 24, 
  color: s.color 
})}
                   </Box>
                <Typography fontWeight={700} fontSize={20}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Bookings + travelers table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.darkKhakhi[100]}` }}>
          <Typography variant="h6" fontWeight={700}>
            Bookings &amp; Travelers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} ·{' '}
            {confirmedCount} confirmed · {pendingCount} pending
          </Typography>
        </Box>

        {bookings.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No bookings yet for this trip.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.wheat[50] }}>
                  {[
                    'Booking Ref', 'Main Traveler', 'Additional Travelers',
                    'Contact', 'Total Price', 'Payment', 'Status', 'Actions',
                  ].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: colors.darkKhakhi[700], whiteSpace: 'nowrap' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {bookings.map((booking) => {
                  const main        = booking.mainTravelerId as TravelerResponse;
                  const additional  = (booking.additionalTravelerIds ?? []) as TravelerResponse[];
                  const statusStyle = STATUS_COLORS[booking.status]  ?? STATUS_COLORS.pending;
                  const payStyle    = PAYMENT_COLORS[booking.paymentStatus] ?? PAYMENT_COLORS.pending;

                  return (
                    <TableRow
                      key={booking._id}
                      sx={{ '&:hover': { bgcolor: colors.wheat[50] } }}
                    >
                      {/* Booking ref */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {booking.bookingNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {fmt(booking.bookingDate)}
                        </Typography>
                      </TableCell>

                      {/* Main traveler */}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: colors.oliveWood[500], width: 32, height: 32, fontSize: 13 }}>
                            {main?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} fontSize={13}>{main?.fullName ?? '—'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {main?.idType ?? ''} · {main?.idNumber ?? ''}
                            </Typography>
                            {main?.isStudent && (
                              <Chip label="Student" size="small" sx={{ ml: 0.5, height: 16, fontSize: 10 }} />
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Additional travelers */}
                      <TableCell>
                        {additional.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">None</Typography>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {additional.map((a: TravelerResponse) => (
                              <Typography key={a._id} variant="body2" fontSize={13}>
                                {a.fullName}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </TableCell>

                      {/* Contact */}
                      <TableCell>
                        <Typography variant="body2" fontSize={12}>{booking.contactEmail}</Typography>
                        <Typography variant="body2" fontSize={12} color="text.secondary">
                          {booking.contactPhone}
                        </Typography>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <Typography fontWeight={600}>{formatPrice(booking.totalPrice)}</Typography>
                      </TableCell>

                      {/* Payment status */}
                      <TableCell>
                        <Chip
                          label={booking.paymentStatus}
                          size="small"
                          sx={{ bgcolor: payStyle.bg, color: payStyle.color, fontWeight: 600, textTransform: 'capitalize' }}
                        />
                      </TableCell>

                      {/* Booking status */}
                      <TableCell>
                        <Chip
                          label={booking.status}
                          size="small"
                          sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600, textTransform: 'capitalize' }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        {booking.status === 'pending' && (
                          <Tooltip title="Confirm booking & send email to traveler">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleConfirm(booking._id)}
                                disabled={confirming === booking._id}
                                sx={{ color: '#15803d' }}
                              >
                                {confirming === booking._id
                                  ? <CircularProgress size={16} />
                                  : <FiCheckCircle size={18} />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default TripPreviewPage;