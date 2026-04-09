import { Box, Typography, Card, CardContent, CircularProgress, Container, Alert, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import TripServices from '@/ApiCalls/TripApi';
import type { TripInput } from '@/types';
import { Theme } from '@/assets/constants/colors';
import { colors } from '@/assets/constants/theme';

interface DestinationSelectionProps {
  // ✅ Aligned with BookingPage — selection is always a concrete TripInput, never null
  onDestinationSelect?: (destination: TripInput) => void;
  selectedDestination?: TripInput | null;
}

export default function DestinationSelection({
  onDestinationSelect,
  selectedDestination: propSelectedDestination,
}: DestinationSelectionProps = {}) {
  const [destinations, setDestinations] = useState<TripInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Derive selected state directly from prop — no local duplicate, no useEffect setState
  const selectedDestination = propSelectedDestination ?? null;

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TripServices.getAllTrips();
      const trips: TripInput[] = response.data.data ?? [];
      setDestinations(trips);
    } catch (err) {
      setError('Failed to fetch destinations. Please try again.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSelect = (destination: TripInput) => {
    onDestinationSelect?.(destination);
  };

  const formatDuration = (startDate: string | Date, endDate: string | Date): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  };

    const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
  }).format(price);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={fetchAllTrips}>Try Again</Button>
      </Container>
    );
  }

  if (destinations.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">No destinations available at the moment. Please check back later.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600, mb: 1 }}>
          Choose Your Destination
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Select your preferred safari destination
        </Typography>
      </Box>

      {/* Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        flex: 1,
      }}>
        {destinations.map((destination) => {
          // ✅ Compare by _id if available, fall back to title
          const isSelected = selectedDestination?.title === destination.title;

          return (
            <Card
              key={destination.title}
              onClick={() => handleDestinationSelect(destination)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDestinationSelect(destination);
                }
              }}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                border: isSelected ? `3px solid ${colors.darkKhakhi[600]}` : '3px solid transparent',
                transform: isSelected ? 'translateY(-5px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: (theme) => theme.shadows[6] },
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', flex: 1 }}>
                {/* Image */}
                <Box sx={{
                  alignSelf: 'center', width: 80, height: 80, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', backgroundColor: Theme.wheat[100],
                }}>
                  {destination.image ? (
                    <img
                      src={destination.image}
                      alt={destination.title}
                      style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: Theme.bronze[200], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ color: Theme.bronze[600], fontSize: '12px' }}>No Image</Typography>
                    </Box>
                  )}
                </Box>

                {/* Title */}
                <Typography variant="h6" sx={{ fontWeight: 600, color: Theme['dark-khakhi'][800], textAlign: 'center' }}>
                  {destination.title}
                </Typography>

                {/* Description */}
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', textAlign: 'center', lineHeight: 1.6, overflow: 'auto', maxHeight: '100px' }}>
                  {destination.description}
                </Typography>

                {/* Footer */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 2, borderTop: `1px solid ${Theme.bronze[100]}` }}>
                  <Typography sx={{ color: Theme.bronze[600], fontWeight: 500, fontSize: '14px' }}>
                    {formatDuration(destination.startDate, destination.endDate)}
                  </Typography>
                  <Typography sx={{ color: Theme.bronze[700], fontWeight: 700, fontSize: '16px' }}>
                    {formatPrice(destination.price)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Selection confirmation */}
      {selectedDestination && (
        <Box sx={{ pt: 3, borderTop: `1px solid ${Theme.bronze[200]}`, textAlign: 'center' }}>
          <Typography sx={{ color: Theme.bronze[600], fontWeight: 500 }}>
            Selected: {selectedDestination.title}
          </Typography>
          <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', mt: 1 }}>
            Click Continue to proceed with this destination
          </Typography>
        </Box>
      )}
    </Box>
  );
}