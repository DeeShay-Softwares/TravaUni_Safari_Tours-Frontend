// components/AlreadyBookedModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';
import { FiMail, FiCalendar, FiHash } from 'react-icons/fi';
import { colors } from '@/assets/constants/theme';

export interface AlreadyBookedInfo {
  travelerName:  string;
  travelerEmail: string;
  tripTitle:     string;
  bookingNumber: string;
  bookingDate:   string;
  status:        string;
}

interface AlreadyBookedModalProps {
  open:     boolean;
  info:     AlreadyBookedInfo | null;
  onClose:  () => void;
}

export default function AlreadyBookedModal({
  open,
  info,
  onClose,
}: AlreadyBookedModalProps) {
  if (!info) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display:    'flex',
          alignItems: 'center',
          gap:        1.5,
          color:      colors.bronze[800],
          fontWeight: 700,
          pb:         1,
        }}
      >
        <FaExclamationTriangle color={colors.bronze[500]} size={20} />
        Already Booked for This Trip
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ color: colors.darkKhakhi[700], mb: 3 }}>
          <strong>{info.travelerName}</strong> is already registered for{' '}
          <strong>{info.tripTitle}</strong>. A reminder has been sent to their
          email address.
        </Typography>

        {/* Details card */}
        <Box
          sx={{
            p:            2.5,
            borderRadius: 2,
            border:       `1px solid ${colors.bronze[200]}`,
            bgcolor:      colors.wheat[50],
            display:      'flex',
            flexDirection:'column',
            gap:          1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiMail size={15} color={colors.bronze[500]} />
            <Typography variant="body2" sx={{ color: colors.darkKhakhi[600] }}>
              Reminder sent to: <strong>{info.travelerEmail}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiHash size={15} color={colors.bronze[500]} />
            <Typography variant="body2" sx={{ color: colors.darkKhakhi[600] }}>
              Booking reference: <strong>{info.bookingNumber}</strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiCalendar size={15} color={colors.bronze[500]} />
            <Typography variant="body2" sx={{ color: colors.darkKhakhi[600] }}>
              Originally booked on:{' '}
              <strong>
                {new Date(info.bookingDate).toLocaleDateString('en-US', {
                  day:   'numeric',
                  month: 'long',
                  year:  'numeric',
                })}
              </strong>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: colors.darkKhakhi[600] }}>
              Status:
            </Typography>
            <Chip
              label={info.status}
              size="small"
              sx={{
                bgcolor:    info.status === 'confirmed' ? '#dcfce7' : colors.wheat[100],
                color:      info.status === 'confirmed' ? '#15803d'  : colors.bronze[700],
                fontWeight: 600,
                fontSize:   '0.75rem',
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ mt: 2.5, color: colors.darkKhakhi[500], fontStyle: 'italic' }}
        >
          The booking was not created. Please contact the traveler if they
          believe this is an error.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor:   colors.bronze[600],
            '&:hover': { bgcolor: colors.bronze[700] },
            px:        4,
          }}
        >
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}