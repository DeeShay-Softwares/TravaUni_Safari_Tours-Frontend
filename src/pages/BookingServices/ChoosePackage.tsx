// PackageSelection.tsx - Step 2 with CSS Grid
import { Box, Typography, Card, CardContent, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { FaCampground } from 'react-icons/fa6';
import { Theme } from '@/assets/constants/colors';
import type { TripInput } from '@/types';
import type { IconType } from 'react-icons';

interface PackageSelectionProps {
  selectedDestination: TripInput | null;
  onPackageSelect?: (selectedPackage: PackageOption | null) => void;
  selectedPackage?: PackageOption | null;
}

export interface PackageOption {
  id: string;
  name: string;
  icon: IconType; // ✅ Fix 1: proper type instead of `any`
  basePrice: number;
  totalPrice: number;
  formattedPrice: string;
  features: string[];
  color: string;
  additionalPrice: number;
  description: string;
}

export default function PackageSelection({ 
  selectedDestination, 
  onPackageSelect,
  selectedPackage: propSelectedPackage 
}: PackageSelectionProps) {
  
  // ✅ Fix 2: Derive selectedPackageId directly from prop — no useEffect needed
  const selectedPackageId = propSelectedPackage?.id ?? null;

  const handlePackageSelect = (pkg: PackageOption) => {
    onPackageSelect?.(pkg);
  };

  const getPackages = (destination: TripInput): PackageOption[] => {
    const basePrice = destination.price;
    return [
      {
        id: 'basic',
        name: "Basic Safari Experience",
        icon: FaCampground,
        basePrice: basePrice,
        totalPrice: basePrice,
        formattedPrice: formatPrice(basePrice),
        features: [
          "Standard accommodations",
          "Group game drives (max 8 people)",
          "Breakfast and dinner included",
          "Park entrance fees covered",
          "Professional safari guide",
          "Airport transfers"
        ],
        color: Theme.wheat[600],
        additionalPrice: 0,
        description: "Perfect for budget-conscious travelers who want to experience the best of the wild without compromising on quality."
      },
    ];
  };

  if (!selectedDestination) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Typography sx={{ color: Theme['dark-khakhi'][600] }}>
          Please select a destination first
        </Typography>
      </Box>
    );
  }

  const hasPackages = false;

  if (!hasPackages) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        p: { xs: 2, sm: 3, md: 4 }
      }}>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600 }}>
          Your Selected Destination
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Review your chosen safari destination
        </Typography>

        <Card sx={{
          maxWidth: 800,
          mx: 'auto',
          width: '100%',
          boxShadow: 3,
          borderTop: `4px solid ${Theme.bronze[600]}`
        }}>
          <CardContent sx={{ p: 4 }}>
            {selectedDestination.image && (
              <Box sx={{ width: '100%', height: 250, mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                <img 
                  src={selectedDestination.image} 
                  alt={selectedDestination.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            <Typography variant="h5" sx={{ fontWeight: 700, color: Theme.bronze[700], mb: 2, textAlign: 'center' }}>
              {selectedDestination.title}
            </Typography>

            <Box sx={{
              display: 'inline-block', px: 2, py: 0.5,
              bgcolor: Theme.wheat[100], borderRadius: 2, mb: 2,
              mx: 'auto', width: 'fit-content'
            }}>
              <Typography sx={{ color: Theme.bronze[600], fontSize: '14px', fontWeight: 500 }}>
                📍 {selectedDestination.location}
              </Typography>
            </Box>

            <Typography sx={{
              color: Theme['dark-khakhi'][700], fontSize: '16px',
              lineHeight: 1.6, mb: 3, textAlign: 'center'
            }}>
              {selectedDestination.description}
            </Typography>

            <Box sx={{ height: 1, bgcolor: Theme.bronze[200], my: 3 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', fontWeight: 500, mb: 1 }}>
                  Duration
                </Typography>
                <Typography sx={{ color: Theme.bronze[700], fontSize: '20px', fontWeight: 700 }}>
                  {formatDuration(selectedDestination.startDate, selectedDestination.endDate)}
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>
                  {formatDate(selectedDestination.startDate)} - {formatDate(selectedDestination.endDate)}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', fontWeight: 500, mb: 1 }}>
                  Base Price
                </Typography>
                <Typography sx={{ color: Theme.bronze[700], fontSize: '28px', fontWeight: 700 }}>
                  {formatPrice(selectedDestination.price)}
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>
                  per person
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3, p: 3, bgcolor: `${Theme.wheat[100]}80`, borderRadius: 2, textAlign: 'center' }}>
              <Typography sx={{ color: Theme.bronze[600], fontSize: '16px', fontWeight: 600, mb: 1 }}>
                ✨ Package Options Coming Soon! ✨
              </Typography>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', mb: 1 }}>
                We're working on exciting package upgrades to enhance your safari experience.
              </Typography>
              <Typography sx={{ color: Theme.bronze[600], fontSize: '13px', fontStyle: 'italic', mb: 3 }}>
                For now, you'll pay the base destination price of {formatPrice(selectedDestination.price)}
              </Typography>

              {/* ✅ Fix 3: Select button to enable Continue */}
              <Button
                variant="contained"
                onClick={() => {
                  // Create a minimal package from the destination so the parent
                  // knows the user has confirmed and can enable Continue
                  const defaultPackage: PackageOption = {
                    id: 'base',
                    name: 'Base Destination Price',
                    icon: FaCampground,
                    basePrice: selectedDestination.price,
                    totalPrice: selectedDestination.price,
                    formattedPrice: formatPrice(selectedDestination.price),
                    features: [],
                    color: Theme.bronze[600],
                    additionalPrice: 0,
                    description: 'Base destination price'
                  };
                  onPackageSelect?.(defaultPackage);
                }}
                sx={{
                  bgcolor: selectedPackageId === 'base' ? Theme.bronze[800] : Theme.bronze[600],
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '15px',
                  fontWeight: 600,
                  borderRadius: 2,
                  '&:hover': { bgcolor: Theme.bronze[800] }
                }}
              >
                {selectedPackageId === 'base' ? '✓ Selected — Ready to Continue' : 'Select & Continue'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Package selection section (for when packages are implemented)
  const packages = getPackages(selectedDestination);
  const currentSelectedPackage = packages.find(p => p.id === selectedPackageId);

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      <Box>
        <Typography variant="h4" sx={{ color: Theme.bronze[700], fontWeight: 600, mb: 1 }}>
          Choose Your Safari Package
        </Typography>
        <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '16px' }}>
          Enhance your {selectedDestination.title} experience with one of our curated packages
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex', gap: 2, p: 2, bgcolor: Theme.wheat[50],
        borderRadius: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: Theme.bronze[600] }}>Destination:</Typography>
          <Typography sx={{ color: Theme['dark-khakhi'][700] }}>{selectedDestination.title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: Theme.bronze[600] }}>Location:</Typography>
          <Typography sx={{ color: Theme['dark-khakhi'][700] }}>{selectedDestination.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontWeight: 600, color: Theme.bronze[600] }}>Base Price:</Typography>
          <Typography sx={{ color: Theme.bronze[700], fontWeight: 700 }}>{formatPrice(selectedDestination.price)}</Typography>
        </Box>
      </Box>

      <RadioGroup
        value={selectedPackageId}
        onChange={(e) => {
          const selected = packages.find(p => p.id === e.target.value);
          if (selected) handlePackageSelect(selected);
        }}
        sx={{ flex: 1 }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3, alignContent: 'start' }}>
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = selectedPackageId === pkg.id;

            return (
              <FormControlLabel
                key={pkg.id}
                value={pkg.id}
                control={<Radio sx={{ display: 'none' }} />}
                label={
                  <Card sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    border: isSelected ? `3px solid ${pkg.color}` : `1px solid ${Theme['dark-khakhi'][200]}`,
                    backgroundColor: isSelected ? `${pkg.color}10` : 'white',
                    transform: isSelected ? 'translateY(-5px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: (theme) => theme.shadows[6] }
                  }}>
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%', flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{
                          width: 60, height: 60, borderRadius: '50%',
                          backgroundColor: `${pkg.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={28} color={pkg.color} />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: pkg.color }}>
                            {pkg.formattedPrice}
                          </Typography>
                          {pkg.additionalPrice > 0 && (
                            <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>
                              +{formatPrice(pkg.additionalPrice)} upgrade
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, color: Theme['dark-khakhi'][800], textAlign: 'center' }}>
                        {pkg.name}
                      </Typography>

                      <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '13px', textAlign: 'center', fontStyle: 'italic' }}>
                        {pkg.description}
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, mt: 1 }}>
                        {pkg.features.slice(0, 5).map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: pkg.color }} />
                            <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px' }}>{feature}</Typography>
                          </Box>
                        ))}
                        {pkg.features.length > 5 && (
                          <Typography sx={{ color: pkg.color, fontSize: '11px', mt: 0.5, fontStyle: 'italic' }}>
                            +{pkg.features.length - 5} more features
                          </Typography>
                        )}
                      </Box>

                      {/* ✅ Fix 3: Select button on each package card */}
                      <Button
                        variant={isSelected ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePackageSelect(pkg);
                        }}
                        sx={{
                          mt: 2,
                          bgcolor: isSelected ? pkg.color : 'transparent',
                          borderColor: pkg.color,
                          color: isSelected ? 'white' : pkg.color,
                          fontWeight: 700,
                          fontSize: '13px',
                          '&:hover': { bgcolor: pkg.color, color: 'white' }
                        }}
                      >
                        {isSelected ? '✓ Selected' : 'Select Package'}
                      </Button>
                    </CardContent>
                  </Card>
                }
                sx={{ width: '100%', m: 0, alignItems: 'stretch' }}
              />
            );
          })}
        </Box>
      </RadioGroup>

      {currentSelectedPackage && (
        <Box sx={{ mt: 3, p: 3, bgcolor: Theme.wheat[50], borderRadius: 2, border: `2px solid ${Theme.bronze[200]}` }}>
          <Typography variant="h6" sx={{ color: Theme.bronze[700], fontWeight: 700, mb: 2 }}>
            Package Summary
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', mb: 1 }}>
                <strong>Base Safari Price:</strong> {formatPrice(currentSelectedPackage.basePrice)}
              </Typography>
              {currentSelectedPackage.additionalPrice > 0 && (
                <Typography sx={{ color: Theme['dark-khakhi'][600], fontSize: '14px', mb: 1 }}>
                  <strong>Package Upgrade:</strong> +{formatPrice(currentSelectedPackage.additionalPrice)}
                </Typography>
              )}
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${Theme.bronze[300]}` }}>
                <Typography sx={{ color: Theme.bronze[700], fontSize: '20px', fontWeight: 800 }}>
                  Total: {currentSelectedPackage.formattedPrice}
                </Typography>
                <Typography sx={{ color: Theme['dark-khakhi'][500], fontSize: '12px' }}>per person</Typography>
              </Box>
            </Box>
            <Box>
              <Typography sx={{ color: Theme.bronze[600], fontSize: '14px', fontWeight: 600, mb: 1 }}>
                Package Includes:
              </Typography>
              <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
                {currentSelectedPackage.features.map((feature, idx) => (
                  <Typography key={idx} sx={{ color: Theme['dark-khakhi'][600], fontSize: '12px', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    ✓ {feature}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function formatDuration(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}