// components/RegistrationDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Chip, Button, Avatar,
  IconButton, CircularProgress, Tooltip,
} from '@mui/material';
import {
  FiX, FiCheckCircle, FiXCircle, FiMail, FiPhone,
FiMapPin, FiHash, FiDollarSign,
  FiUsers, FiFileText,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { colors } from '@/assets/constants/theme';
import BookingServices from '@/ApiCalls/BookingApi';
import type { BookingResponse, PopulatedTrip } from '@/ApiCalls/BookingApi';
import type { TravelerResponse } from '@/ApiCalls/travelerApi';
import type { Registration } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface RegistrationDetailsModalProps {
  registration: Registration | null;
  open:         boolean;
  onClose:      () => void;
  onConfirm:    (id: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: string | Date | undefined) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const formatPrice = (p: number, currency = 'ZMW') =>
  new Intl.NumberFormat('en-ZM', {
    style: 'currency', currency, currencyDisplay: 'symbol', minimumFractionDigits: 0,
  }).format(p);

const ID_TYPE_LABELS: Record<string, string> = {
  'passport':       'Passport',
  'national-id':    'National ID',
  'driver-license': "Driver's Licence",
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: '#dcfce7', color: '#15803d' },
  pending:   { bg: '#fef9c3', color: '#854d0e' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
  completed: { bg: '#dbeafe', color: '#1d4ed8' },
};

const PAYMENT_STYLES: Record<string, { bg: string; color: string }> = {
  completed: { bg: '#dcfce7', color: '#15803d' },
  paid:      { bg: '#dcfce7', color: '#15803d' },
  partial:   { bg: '#fef9c3', color: '#854d0e' },
  pending:   { bg: '#fee2e2', color: '#b91c1c' },
  refunded:  { bg: '#f3e8ff', color: '#7e22ce' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box sx={{ color: colors.bronze[500] }}>{icon}</Box>
      <Typography
        variant="overline"
        sx={{ fontWeight: 700, color: colors.darkKhakhi[600], letterSpacing: 1.2 }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box
      sx={{
        display:       'grid',
        gridTemplateColumns: '140px 1fr',
        gap:           1,
        py:            0.75,
        borderBottom:  `1px solid ${colors.wheat[100]}`,
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Typography variant="body2" sx={{ color: colors.darkKhakhi[500], fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: colors.darkKhakhi[800] }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
}

function TravelerCard({
  traveler,
  label,
}: {
  traveler: TravelerResponse | Record<string, object>;
  label:    string;
}) {
  const t = traveler as TravelerResponse;
  return (
    <Box
      sx={{
        p:            2,
        borderRadius: 2,
        border:       `1px solid ${colors.bronze[100]}`,
        bgcolor:      colors.wheat[50],
        mb:           1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: colors.oliveWood[500], width: 36, height: 36, fontSize: 14 }}>
          {t.fullName?.charAt(0)?.toUpperCase() ?? '?'}
        </Avatar>
        <Box>
          <Typography fontWeight={700} fontSize={14} sx={{ color: colors.darkKhakhi[900] }}>
            {t.fullName ?? '—'}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.darkKhakhi[500] }}>
            {label}
          </Typography>
        </Box>
        {t.isStudent && (
          <Chip
            label="Student"
            size="small"
            sx={{ ml: 'auto', bgcolor: colors.wheat[200], color: colors.bronze[700], fontWeight: 600 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <InfoRow label="Age"          value={t.age ? `${t.age} years` : '—'} />
        <InfoRow label="Gender"       value={t.gender} />
        <InfoRow label="Nationality"  value={t.nationality} />
        <InfoRow label="Date of Birth" value={fmt(t.dateOfBirth)} />
        <InfoRow
          label="ID"
          value={
            t.idNumber
              ? `${ID_TYPE_LABELS[t.idType] ?? t.idType ?? 'ID'}: ${t.idNumber}`
              : '—'
          }
        />
        {t.isStudent && t.schoolName && (
          <InfoRow label="Institution" value={t.schoolName} />
        )}
      </Box>
    </Box>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────

const RegistrationDetailsModal: React.FC<RegistrationDetailsModalProps> = ({
  registration,
  open,
  onClose,
  onConfirm,
}) => {
  const [booking,    setBooking]    = useState<BookingResponse | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // ── Fetch full booking when modal opens ────────────────────────────────────
  useEffect(() => {
    if (!open || !registration) {
      setBooking(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    BookingServices.getBookingById(registration.id)
      .then((data) => { if (!cancelled) setBooking(data); })
      .catch(() => { if (!cancelled) setBooking(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [open, registration]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!booking) return;
    setConfirming(true);
    try {
      await BookingServices.confirmBooking(booking._id);
      onConfirm(booking._id);
      // Refresh local state
      const updated = await BookingServices.getBookingById(booking._id);
      setBooking(updated);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      await BookingServices.cancelBooking(booking._id);
      const updated = await BookingServices.getBookingById(booking._id);
      setBooking(updated);
    } finally {
      setCancelling(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const trip           = booking?.tripId      as PopulatedTrip | undefined;
  const mainTraveler   = booking?.mainTravelerId as TravelerResponse | undefined;
  const additionalTravelers = (booking?.additionalTravelerIds ?? []) as TravelerResponse[];

  const statusStyle  = STATUS_STYLES[booking?.status  ?? 'pending'] ?? STATUS_STYLES.pending;
  const paymentStyle = PAYMENT_STYLES[booking?.paymentStatus ?? 'pending'] ?? PAYMENT_STYLES.pending;

  const isPending   = booking?.status === 'pending';
  const isCancelled = booking?.status === 'cancelled';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, maxHeight: '90vh' } }}
    >
      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          pb:             1.5,
          borderBottom:   `1px solid ${colors.darkKhakhi[100]}`,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: colors.darkKhakhi[900] }}>
            Booking Details
          </Typography>
          {booking && (
            <Typography variant="caption" sx={{ color: colors.darkKhakhi[500], fontFamily: 'monospace' }}>
              {booking.bookingNumber}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {booking && (
            <>
              <Chip
                label={booking.status}
                size="small"
                sx={{
                  bgcolor:         statusStyle.bg,
                  color:           statusStyle.color,
                  fontWeight:      700,
                  textTransform:   'capitalize',
                }}
              />
              <Chip
                label={booking.paymentStatus === 'completed' ? 'paid' : booking.paymentStatus}
                size="small"
                sx={{
                  bgcolor:       paymentStyle.bg,
                  color:         paymentStyle.color,
                  fontWeight:    700,
                  textTransform: 'capitalize',
                }}
              />
            </>
          )}
          <IconButton size="small" onClick={onClose} sx={{ color: colors.darkKhakhi[400] }}>
            <FiX />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !booking ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Failed to load booking details.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {/* ── Trip info ─────────────────────────────────────────── */}
            <Box>
              <SectionTitle icon={<FiMapPin size={15} />} label="Trip" />
              <Box
                sx={{
                  p:            2,
                  borderRadius: 2,
                  border:       `1px solid ${colors.bronze[100]}`,
                  bgcolor:      colors.wheat[50],
                }}
              >
                <Typography fontWeight={700} fontSize={16} sx={{ color: colors.darkKhakhi[900], mb: 1 }}>
                  {trip?.title ?? '—'}
                </Typography>
                <InfoRow label="Location"     value={trip?.location} />
                <InfoRow label="Travel Dates" value={
                  booking.travelDates?.start
                    ? `${fmt(booking.travelDates.start)} → ${fmt(booking.travelDates.end)}`
                    : '—'
                } />
                <InfoRow label="Booked On"    value={fmt(booking.bookingDate)} />
              </Box>
            </Box>

            {/* ── Pricing ───────────────────────────────────────────── */}
            <Box>
              <SectionTitle icon={<FiDollarSign size={15} />} label="Payment" />
              <Box
                sx={{
                  p:            2,
                  borderRadius: 2,
                  border:       `1px solid ${colors.bronze[100]}`,
                  bgcolor:      colors.wheat[50],
                }}
              >
                <InfoRow
                  label="Total Price"
                  value={
                    <Typography fontWeight={700} sx={{ color: colors.oliveWood[600] }}>
                      {formatPrice(booking.totalPrice, booking.currency)}
                    </Typography>
                  }
                />
                <InfoRow
                  label="Payment Status"
                  value={
                    <Chip
                      label={booking.paymentStatus === 'completed' ? 'Paid' : booking.paymentStatus}
                      size="small"
                      sx={{ bgcolor: paymentStyle.bg, color: paymentStyle.color, fontWeight: 600, textTransform: 'capitalize' }}
                    />
                  }
                />
                <InfoRow label="Currency" value={booking.currency} />
              </Box>
            </Box>

            {/* ── Contact ───────────────────────────────────────────── */}
            <Box>
              <SectionTitle icon={<FiPhone size={15} />} label="Contact Information" />
              <Box
                sx={{
                  p:            2,
                  borderRadius: 2,
                  border:       `1px solid ${colors.bronze[100]}`,
                  bgcolor:      colors.wheat[50],
                }}
              >
                <InfoRow
                  label="Email"
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {booking.contactEmail}
                      <Tooltip title="Send email">
                        <IconButton
                          size="small"
                          onClick={() => { window.location.href = `mailto:${booking.contactEmail}`; }}
                          sx={{ color: colors.bronze[500], p: 0.25 }}
                        >
                          <FiMail size={13} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                <InfoRow
                  label="Phone"
                  value={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {booking.contactPhone}
                      <Tooltip title="Send WhatsApp">
                        <IconButton
                          size="small"
                          onClick={() => window.open(`https://wa.me/${booking.contactPhone}`, '_blank')}
                          sx={{ color: '#25D366', p: 0.25 }}
                        >
                          <FaWhatsapp size={13} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </Box>
            </Box>

            {/* ── Travelers ─────────────────────────────────────────── */}
            <Box>
              <SectionTitle
                icon={<FiUsers size={15} />}
                label={`Travelers (${1 + additionalTravelers.length})`}
              />
              {mainTraveler && (
                <TravelerCard traveler={mainTraveler} label="Main Traveler" />
              )}
              {additionalTravelers.map((t, i) => (
                <TravelerCard
                  key={t._id ?? i}
                  traveler={t}
                  label={`Traveler ${i + 2}`}
                />
              ))}
            </Box>

            {/* ── Special requests ──────────────────────────────────── */}
            {booking.specialRequests && (
              <Box>
                <SectionTitle icon={<FiFileText size={15} />} label="Special Requests" />
                <Box
                  sx={{
                    p:            2,
                    borderRadius: 2,
                    border:       `1px solid ${colors.bronze[100]}`,
                    bgcolor:      colors.wheat[50],
                  }}
                >
                  <Typography variant="body2" sx={{ color: colors.darkKhakhi[700], lineHeight: 1.7 }}>
                    {booking.specialRequests}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* ── Booking meta ──────────────────────────────────────── */}
            <Box>
              <SectionTitle icon={<FiHash size={15} />} label="Booking Reference" />
              <Box
                sx={{
                  p:            2,
                  borderRadius: 2,
                  border:       `1px solid ${colors.bronze[100]}`,
                  bgcolor:      colors.wheat[50],
                }}
              >
                <InfoRow
                  label="Booking #"
                  value={
                    <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {booking.bookingNumber}
                    </Typography>
                  }
                />
                <InfoRow
                  label="Main Traveler ID"
                  value={
                    <Typography sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {mainTraveler?._id ?? '—'}
                    </Typography>
                  }
                />
                <InfoRow label="Created"  value={fmt(booking.createdAt)} />
                <InfoRow label="Updated"  value={fmt(booking.updatedAt)} />
              </Box>
            </Box>

          </Box>
        )}
      </DialogContent>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      {booking && (
        <DialogActions
          sx={{
            px:         3,
            py:         2,
            borderTop:  `1px solid ${colors.darkKhakhi[100]}`,
            gap:        1.5,
            flexWrap:   'wrap',
          }}
        >
          {/* Quick-contact buttons */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<FiMail size={14} />}
            onClick={() => { window.location.href = `mailto:${booking.contactEmail}`; }}
            sx={{ borderColor: colors.bronze[300], color: colors.bronze[700] }}
          >
            Email
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FaWhatsapp size={14} />}
            onClick={() => window.open(`https://wa.me/${booking.contactPhone}`, '_blank')}
            sx={{ borderColor: '#25D366', color: '#25D366' }}
          >
            WhatsApp
          </Button>

          <Box sx={{ flex: 1 }} />

          {/* Cancel — only if not already cancelled */}
          {!isCancelled && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={
                cancelling
                  ? <CircularProgress size={14} color="inherit" />
                  : <FiXCircle size={14} />
              }
              onClick={handleCancel}
              disabled={cancelling || confirming}
            >
              Cancel Booking
            </Button>
          )}

          {/* Confirm — only if still pending */}
          {isPending && (
            <Button
              size="small"
              variant="contained"
              startIcon={
                confirming
                  ? <CircularProgress size={14} color="inherit" />
                  : <FiCheckCircle size={14} />
              }
              onClick={handleConfirm}
              disabled={confirming || cancelling}
              sx={{
                bgcolor:   colors.oliveWood[600],
                '&:hover': { bgcolor: colors.oliveWood[700] },
              }}
            >
              Confirm Booking
            </Button>
          )}

          <Button size="small" onClick={onClose} sx={{ color: colors.darkKhakhi[600] }}>
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default RegistrationDetailsModal;