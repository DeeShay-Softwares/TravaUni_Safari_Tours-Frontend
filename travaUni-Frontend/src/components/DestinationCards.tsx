import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { FiMapPin } from 'react-icons/fi';
import { typography } from '../assets/constants/typography';
import { Theme } from '../assets/constants/colors';

// Styled Paper component for cards
const Item = styled(Paper)({
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
});

// Data for Zambian destinations
const destinations = [
  {
    id: 1,
    location: "Kafue",
    province: "Kafue National Park",
    title: "Kafue Hippo View Safari",
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    tags: [ "Boat Cruise", "Game Watching"]
  },
  {
    id: 2,
    location: "Siavonga",
    province: "Southern Province",
    title: "Lake Kariba Adventure",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    tags: ["Dam Wall", "Swimming", "Boat Cruise"]
  },
  {
    id: 3,
    location: "Mazabuka",
    province: "Southern Province",
    title: "Mainess Game Ranch",
    imageUrl: "https://images.unsplash.com/photo-1504173010664-32509aeebb62?auto=format&fit=crop&w=800&q=80",
    tags: ["Hiking", "Game View", "Braai", "Games"]
  },
  {
    id: 4,
    location: "Rufunsa",
    province: "Lusaka Province",
    title: "Twaala Village Farm Experience",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    tags: ["Hot Springs", "Waterfalls", "Bonfire", "Road Trip"]
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
        <Grid size={{ xs: 6, md: 7 }}>
          <DestinationCard destination={destinations[0]} />
        </Grid>
        <Grid size={{ xs: 6, md: 5 }}>
          <DestinationCard destination={destinations[1]} />
        </Grid>
        
        {/* Second Row: 2 columns on mobile, 5-7 on desktop */}
        <Grid size={{ xs: 6, md: 5 }}>
          <DestinationCard destination={destinations[2]} />
        </Grid>
        <Grid size={{ xs: 6, md: 7 }}>
          <DestinationCard destination={destinations[3]} />
        </Grid>
      </Grid>
    </Box>
  );
}

// Destination type definition
type Destination = {
  id: number;
  location: string;
  province: string;
  title: string;
  imageUrl: string;
  tags: string[];
};

// Main Destination Card Component
function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Item>
      <Box sx={{ 
        position: 'relative', 
        height: { xs: 250, md: 350 }
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
          p: { xs: 2, md: 4 },
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
              display: { xs: 'none', md: 'flex' }
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
              display: { xs: 'flex', md: 'none' }
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
                xs: '0.9rem',     
                sm: '1rem',       
                md: '1.5rem',     
                lg: '2rem',       
                xl: '2.5rem'     
              },
              lineHeight: {
                xs: 1.1,
                md: 1.2
              },
              maxHeight: { xs: '2.2em', md: 'none' },
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: { xs: 2, md: 'none' },
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
              display: { xs: 'none', md: 'flex' }
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