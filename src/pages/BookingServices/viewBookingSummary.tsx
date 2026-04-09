// BookingSummary.tsx  (Step 3 — Review only)
//
// Responsibility: let the user review everything they've entered.
// No traveler creation, no booking creation.
// "Confirm & Proceed to Payment" simply calls onProceedToPayment() so the
// parent can advance to the PaymentDetails step, which owns all API work.

import {
  Box, Typography, List, ListItem, ListItemText, ListItemIcon,
  Divider, Chip, Button
} from '@mui/material';
import {
  FaCheck, FaCalendar, FaUsers, FaStar, FaMoneyBillWave, FaIdCard,
} from 'react-icons/fa6';
import { FaMapMarkedAlt, FaEdit } from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';
import type { TripInput } from '@/types';
import type { PackageOption } from './ChoosePackage';
import type { TravelerInfo, Traveler } from './TravelersDetails';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingSummaryProps {
  bookingData: {
    destination:       TripInput | null;
    selectedPackage:   PackageOption | null;
    travelerInfo:      TravelerInfo | null;
    totalPrice:        number;
    bookingReference?: string;
  };
  onEdit?:              (stepNumber: number) => void;
  onProceedToPayment?:  () => void;   // ← parent advances to PaymentDetails
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ageFromDOB(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getReservationFee(basePrice: number, totalTravelers: number): number {
  const feePerPerson = basePrice < 1000 ? 250 : 500;
  return feePerPerson * totalTravelers;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-ZM', {
    style:                 'currency',
    currency:              'ZMW',
    currencyDisplay:       'symbol',
    minimumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

const getDiffDays = (start: string | Date, end: string | Date) =>
  Math.ceil(
    Math.abs(new Date(end).getTime() - new Date(start).getTime()) /
    (1000 * 60 * 60 * 24),
  );

const ID_TYPE_LABELS: Record<string, string> = {
  'passport':       'Passport',
  'national-id':    'National ID',
  'driver-license': "Driver's Licence",
};

const infoCardSx = {
  display:         'flex',
  gap:             2,
  alignItems:      'center',
  p:               2,
  backgroundColor: Theme.wheat[50],
  borderRadius:    2,
  border:          `1px solid ${Theme.bronze[100]}`,
};

const iconCircleSx = (bg: string) => ({
  width:           40,
  height:          40,
  borderRadius:    '50%',
  flexShrink:      0,
  backgroundColor: bg,
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
});

// ── Sub-components ────────────────────────────────────────────────────────────

function TravelerRow({ traveler, label }: { traveler: Traveler; label: string }) {
  const age = ageFromDOB(traveler.dateOfBirth);
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, color: Theme.bronze[600], fontSize: '13px', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '13px', lineHeight: 1.8 }}>
        {traveler.fullName}
        {age !== null && <> · <span style={{ color: Theme['dark-khakhi'][500] }}>Age {age}</span></>}
        {traveler.gender      && <> · {traveler.gender}</>}
        {traveler.nationality && <> · {traveler.nationality}</>}
      </Typography>
      {(traveler.idType || traveler.idNumber) && (
        <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px', mt: 0.25 }}>
          {traveler.idType ? ID_TYPE_LABELS[traveler.idType] ?? traveler.idType : 'ID'}
          {traveler.idNumber && `: ${traveler.idNumber}`}
        </Typography>
      )}
      {traveler.isStudent && (
        <Typography sx={{ color: Theme['olive-wood'][600], fontSize: '12px', mt: 0.25 }}>
          🎓 Student — {traveler.schoolName || 'institution not specified'}
        </Typography>
      )}
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingSummary({
  bookingData,
  onEdit,
  onProceedToPayment,
}: BookingSummaryProps) {
  const { destination, selectedPackage, travelerInfo, totalPrice } = bookingData;

  const totalTravelers = travelerInfo ? travelerInfo.additionalTravelers.length + 1 : 1;
  const basePrice      = destination?.price ?? 0;
  const packageUpgrade = selectedPackage?.additionalPrice ?? 0;
  const subtotal       = totalPrice * totalTravelers;
  const reservationFee = getReservationFee(basePrice, totalTravelers);
  const taxesAndFees   = 0;
  const grandTotal     = subtotal + taxesAndFees;

  const inclusions = selectedPackage?.features ?? [
    'Standard accommodations',
    'Group game drives',
    'Breakfast and dinner included',
    'Park entrance fees covered',
    'Professional safari guide',
  ];

  const dateRange = destination
    ? `${formatDate(destination.startDate)} – ${formatDate(destination.endDate)}`
    : 'Not selected';

  const duration = destination
    ? `${getDiffDays(destination.startDate, destination.endDate)} days`
    : '';

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>

      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600, mb: 1 }}>
          Booking Summary
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Review your safari adventure details before payment
        </Typography>
      </Box>

      {/* Two-column grid */}
      <Box sx={{
        display:             'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap:                 4,
        flex:                1,
      }}>

        {/* ── Left column ── */}
        <Box sx={{
          display:         'flex',
          flexDirection:   'column',
          gap:             3,
          backgroundColor: 'white',
          borderRadius:    3,
          p:               { xs: 2, sm: 3 },
          boxShadow:       2,
          border:          `1px solid ${Theme.bronze[100]}`,
        }}>

          {/* Destination */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{
                color: Theme.bronze[700], fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <FaMapMarkedAlt size={24} color={Theme.bronze[500]} />
                {destination?.title ?? 'No destination selected'}
              </Typography>
              <Button
                size="small"
                startIcon={<FaEdit />}
                onClick={() => onEdit?.(0)}
                sx={{ color: Theme.bronze[600], '&:hover': { backgroundColor: Theme.bronze[50] } }}
              >
                Edit
              </Button>
            </Box>
            {destination?.location && (
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', mb: 1 }}>
                📍 {destination.location}
              </Typography>
            )}
            {destination?.description && (
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '14px', lineHeight: 1.6 }}>
                {destination.description}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Date & Travelers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box sx={infoCardSx}>
              <Box sx={iconCircleSx(Theme.bronze[100])}>
                <FaCalendar color={Theme.bronze[600]} />
              </Box>
              <Box>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px' }}>Travel Period</Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600, fontSize: '14px' }}>
                  {dateRange}
                </Typography>
                {duration && (
                  <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '11px' }}>
                    {duration}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={infoCardSx}>
              <Box sx={iconCircleSx(Theme['olive-wood'][100])}>
                <FaUsers color={Theme['olive-wood'][600]} />
              </Box>
              <Box>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px' }}>Travelers</Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600, fontSize: '14px' }}>
                  {totalTravelers} {totalTravelers === 1 ? 'Traveler' : 'Travelers'}
                </Typography>
                <Button
                  size="small"
                  onClick={() => onEdit?.(2)}
                  sx={{
                    color: Theme.bronze[600], fontSize: '11px', p: 0, mt: 0.5,
                    '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Package */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{
                color: Theme['dark-khakhi'][800],
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <FaStar color={Theme.bronze[500]} />
                {selectedPackage?.name ?? 'Base Package'}
              </Typography>
              <Button
                size="small"
                startIcon={<FaEdit />}
                onClick={() => onEdit?.(1)}
                sx={{ color: Theme.bronze[600], '&:hover': { backgroundColor: Theme.bronze[50] } }}
              >
                Edit
              </Button>
            </Box>
            <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>
              {selectedPackage?.description ?? 'Base safari experience with standard accommodations'}
            </Typography>
          </Box>

          <Divider />

          {/* Inclusions */}
          <Box>
            <Typography variant="h6" sx={{ color: Theme['dark-khakhi'][800], mb: 2 }}>
              Package Inclusions
            </Typography>
            <List sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1,
            }}>
              {inclusions.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}>
                    <FaCheck size={12} color={Theme['olive-wood'][500]} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{ color: Theme['dark-khakhi'][700], fontSize: '13px' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Traveler Details */}
          {travelerInfo && (
            <>
              <Divider />
              <Box>
                <Typography variant="h6" sx={{
                  color: Theme['dark-khakhi'][800], mb: 2,
                  display: 'flex', alignItems: 'center', gap: 1,
                }}>
                  <FaIdCard size={18} color={Theme.bronze[500]} />
                  Traveler Details
                </Typography>

                <Box sx={{
                  maxHeight: 280, overflow: 'auto',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  <TravelerRow traveler={travelerInfo.mainTraveler} label="Main Traveler" />
                  {travelerInfo.additionalTravelers.map((traveler, idx) => (
                    <TravelerRow
                      key={traveler.id}
                      traveler={traveler}
                      label={`Traveler ${idx + 2}`}
                    />
                  ))}
                </Box>

                {travelerInfo.specialRequest && (
                  <Box sx={{
                    mt: 2, p: 2, borderRadius: 2,
                    backgroundColor: Theme.wheat[50],
                    border: `1px solid ${Theme.bronze[100]}`,
                  }}>
                    <Typography sx={{
                      color: Theme['dark-khakhi'][600], fontSize: '12px', fontWeight: 600, mb: 0.5,
                    }}>
                      Special Requests
                    </Typography>
                    <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '13px', lineHeight: 1.5 }}>
                      {travelerInfo.specialRequest}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* ── Right column — Price summary + CTA ── */}
        <Box sx={{
          display:         'flex',
          flexDirection:   'column',
          gap:             3,
          backgroundColor: Theme.bronze[50],
          borderRadius:    3,
          p:               { xs: 2, sm: 3 },
          border:          `2px solid ${Theme.bronze[200]}`,
          position:        'sticky',
          top:             20,
          alignSelf:       'start',
        }}>
          <Typography variant="h6" sx={{
            color: Theme.bronze[800], fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 1,
          }}>
            <FaMoneyBillWave size={18} />
            Price Summary
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { label: 'Price per person',    value: formatPrice(basePrice) },
              ...(packageUpgrade > 0
                ? [{ label: 'Package upgrade', value: `+${formatPrice(packageUpgrade)}` }]
                : []),
              { label: 'Number of travelers', value: `× ${totalTravelers}` },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px' }}>{label}</Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 500, fontSize: '14px' }}>{value}</Typography>
              </Box>
            ))}

            <Divider sx={{ borderColor: Theme.bronze[200] }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '14px', fontWeight: 500 }}>Subtotal</Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][800], fontWeight: 600, fontSize: '16px' }}>
                {formatPrice(subtotal)}
              </Typography>
            </Box>

            {taxesAndFees > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px' }}>Taxes &amp; Fees</Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][800], fontSize: '13px' }}>
                  {formatPrice(taxesAndFees)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: Theme.bronze[200] }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: Theme.bronze[800], fontWeight: 700 }}>Total</Typography>
              <Typography variant="h5" sx={{ color: Theme.bronze[800], fontWeight: 800 }}>
                {formatPrice(grandTotal)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Chip
              label={`Reservation Fee: ${formatPrice(reservationFee)}`}
              sx={{
                backgroundColor: Theme['olive-wood'][100],
                color:           Theme['olive-wood'][800],
                fontWeight:      600,
                width:           '100%',
                mb:              1.5,
                py:              2,
                '& .MuiChip-label': { fontSize: '14px' },
              }}
            />
            <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '11px', textAlign: 'center', mb: 1 }}>
              {basePrice < 1000
                ? `K250 × ${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''} (trip under K1,000)`
                : `K500 × ${totalTravelers} traveler${totalTravelers > 1 ? 's' : ''} (trip K1,000 or above)`}
            </Typography>
            {[
              '✓ Full refund if cancelled 30+ days before travel',
              '✓ Remaining balance due before departure',
            ].map((text) => (
              <Typography key={text} sx={{
                color: Theme['dark-khakhi'][600], fontSize: '12px', textAlign: 'center', mt: 1,
              }}>
                {text}
              </Typography>
            ))}
          </Box>

          {travelerInfo && (
            <Box sx={{
              mt: 1, pt: 2,
              borderTop:       `1px solid ${Theme.bronze[200]}`,
              backgroundColor: 'white',
              borderRadius:    2,
              p:               2,
            }}>
              <Typography sx={{
                color: Theme['dark-khakhi'][600], fontSize: '12px', fontWeight: 600, mb: 1,
              }}>
                Contact Information
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '12px' }}>
                📧 {travelerInfo.email}
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][700], fontSize: '12px', mt: 0.5 }}>
                📞 {travelerInfo.phone}
              </Typography>
            </Box>
          )}

          {/* CTA — no spinner, no API, just advance the stepper */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onProceedToPayment}
            sx={{
              mt:              2,
              backgroundColor: Theme.bronze[600],
              '&:hover':       { backgroundColor: Theme.bronze[700] },
              py:              1.5,
              fontWeight:      600,
              fontSize:        '16px',
            }}
            startIcon={<FaCheck />}
          >
            Confirm &amp; Proceed to Payment
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{
        display: 'flex', justifyContent: 'center', gap: 3,
        mt: 2, pt: 2, borderTop: `1px solid ${Theme.bronze[200]}`, flexWrap: 'wrap',
      }}>
        {['All details are correct', 'Ready for payment'].map((text) => (
          <Typography key={text} sx={{
            color: Theme['dark-khakhi'][600], fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: 1,
          }}>
            <FaCheck size={12} color={Theme['olive-wood'][600]} />
            {text}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}