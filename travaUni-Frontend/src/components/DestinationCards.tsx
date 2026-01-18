import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { FiMapPin } from 'react-icons/fi';
import { typography } from '../assets/constants/typography';
import { Theme } from '../assets/constants/theme';

// Styled Paper component for cards
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: 0,
  textAlign: 'center',
  color: Theme.wheat[100],
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(155, 100, 23, 0.32)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
  },
}));

// Data for destinations
const destinations = [
  {
    id: 1,
    location: "Bromo",
    province: "East Java",
    title: "Bromo Tengger Tour",
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800',
    tags: ["Adventure", "Volcano", "Sunrise"]
  },
  {
    id: 2,
    location: "Denpasar",
    province: "Bali",
    title: "Bali Beach Tourism",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800",
    tags: ["Beach", "Luxury", "Cultural"]
  },
  {
    id: 3,
    location: "Lampung",
    province: "South Sumatra",
    title: "Sumatra Tourism",
    imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800",
    tags: ["Nature", "Wildlife", "Eco"]
  },
  {
    id: 4,
    location: "Jogjakarta",
    province: "Central Java",
    title: "Borobudur Temple Tour",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800",
    tags: ["Historical", "Cultural", "UNESCO"]
  }
];

export function DestinationCards() {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      py: 4,
      px: { xs: 1, sm: 2, md: 4 } 
    }}>
      {/* Mobile: 2x2 grid, Desktop: 7-5-5-7 layout */}
      <Grid container spacing={3}>
        {/* First Row: 2 columns on mobile, 7-5 on desktop */}
        <Grid size={{ xs: 6, md: 7 }}> {/* Changed to 6 for mobile side-by-side */}
          <DestinationCard destination={destinations[0]} />
        </Grid>
        <Grid size={{ xs: 6, md: 5 }}> {/* Changed to 6 for mobile side-by-side */}
          <DestinationCard destination={destinations[1]} />
        </Grid>
        
        {/* Second Row: 2 columns on mobile, 5-7 on desktop */}
        <Grid size={{ xs: 6, md: 5 }}> {/* Changed to 6 for mobile side-by-side */}
          <DestinationCard destination={destinations[2]} />
        </Grid>
        <Grid size={{ xs: 6, md: 7 }}> {/* Changed to 6 for mobile side-by-side */}
          <DestinationCard destination={destinations[3]} />
        </Grid>
      </Grid>
    </Box>
  );
}

// Main Destination Card Component
function DestinationCard({ destination }: { destination: any }) {
  return (
    <Item>
      <Box sx={{ 
        position: 'relative', 
        height: { xs: 250, md: 350 } // Smaller on mobile
      }}>
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url('${destination.imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&:after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.9) 100%)',
            }
          }}
        />
        
        {/* Content Overlay */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: { xs: 2, md: 4 }, // Smaller padding on mobile
          zIndex: 2,
          textAlign: 'left'
        }}>
          {/* Location - Show only on desktop */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            sx={{ 
              mb: 0.5,
              display: { xs: 'none', md: 'flex' } // Hide on mobile
            }}
          >
            <FiMapPin size={18} color={Theme.bronze[300]} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: Theme.wheat[200], 
                fontWeight: 600,
                opacity: 0.9,
                fontSize: '0.875rem'
              }}
            >
              {destination.location}, {destination.province}
            </Typography>
          </Stack>
          
          {/* Mobile Location (simplified) */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={0.5}
            sx={{ 
              mb: 0.5,
              display: { xs: 'flex', md: 'none' } // Show only on mobile
            }}
          >
            <FiMapPin size={12} color={Theme.bronze[300]} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: Theme.wheat[200], 
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            >
              {destination.location}
            </Typography>
          </Stack>
          
          {/* Title - Responsive font sizes */}
          <Typography 
            sx={{ 
              fontWeight: typography.sectionLabel.fontWeight,
              color: Theme.wheat[100],
              mb: { xs: 0.5, md: 2 },
              fontSize: { 
                xs: '0.9rem',     // Very small on mobile
                sm: '1rem',       // Small on small tablets
                md: '1.5rem',     // Medium on medium screens
                lg: '2rem',       // Large on desktop
                xl: '2.5rem'      // Extra large on big screens
              },
              lineHeight: {
                xs: 1.1,
                md: 1.2
              },
              maxHeight: { xs: '2.2em', md: 'none' }, // Limit to 2 lines on mobile
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, md: 'none' }, // 2 lines on mobile, unlimited on desktop
              WebkitBoxOrient: 'vertical'
            }}
          >
            {destination.title}
          </Typography>
          
          {/* Tags - Show only on desktop */}
          <Stack 
            direction="row" 
            spacing={1} 
            flexWrap="wrap" 
            sx={{ 
              gap: 1, 
              mb: 3,
              display: { xs: 'none', md: 'flex' } // Hide on mobile
            }}
          >
            {destination.tags.map((tag: string, index: number) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  borderRadius: 1,
                  fontWeight: 500,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: Theme.bronze[500],
                  backdropFilter: 'blur(10px)',
                  '& .MuiChip-label': {
                    px: 1.5,
                    fontSize: '0.75rem'
                  }
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Item>
  );
}