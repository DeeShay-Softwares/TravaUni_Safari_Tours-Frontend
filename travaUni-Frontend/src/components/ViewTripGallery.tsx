import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Masonry from './Masonry'; // Your custom Masonry component

// Back to Home Button Component
const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Define your trips and images here - ADD NEW TRIPS HERE
const TRIP_CONFIG = {
  // Example trip 1
  kariba: {
    name: 'Kariba Trip',
    images: [
      {
        id: 'kariba-1',
        img: './public/pictures/pic1.jpeg',
        title: 'Lake Kariba Sunset',
        url: 'https://unsplash.com/photos/1578662996442-48f60103fc96',
        height: 400
      },
      {
        id: 'kariba-2',
        img: './public/pictures/pic2.jpeg',
        title: 'Kariba Houseboat',
        url: 'https://unsplash.com/photos/1559827260-dc66d52bef19',
        height: 350
      },
      {
        id: 'kariba-3',
        img: './public/pictures/pic4.jpeg',
        title: 'Kariba Wildlife',
        url: 'https://unsplash.com/photos/1544551763-46a013bb70d5',
        height: 450
      },
      {
        id: 'kariba-4',
        img: './public/pictures/pic3.jpeg',
        title: 'Kariba Fishing',
        url: 'https://unsplash.com/photos/1516496917-6c6d8dfb5fb6',
        height: 300
      },
      {
        id: 'kariba-5',
        img: './public/pictures/pic5.jpeg',
        title: 'Kariba Dam View',
        url: 'https://unsplash.com/photos/1578662996442-48f60103fc96',
        height: 380
      },
      {
        id: 'kariba-6',
        img: './public/pictures/pic6.jpeg',
        title: 'Elephants at Kariba',
        url: 'https://unsplash.com/photos/1544551763-46a013bb70d5',
        height: 420
      },
    ]
  },
  
  // Example trip 2
  vicfalls: {
    name: 'Victoria Falls Trip',
    images: [
      {
        id: 'vicfalls-1',
        img: './public/pictures/pic8.jpeg',
        title: 'Victoria Falls Main Falls',
        url: 'https://unsplash.com/photos/1600041161228-519e6dd27bac',
        height: 450
      },
      {
        id: 'vicfalls-2',
        img: './public/pictures/pic45.jpeg',
        title: 'Rainbow at the Falls',
        url: 'https://unsplash.com/photos/1589552950456-75eeaf7d2e55',
        height: 380
      },
      {
        id: 'vicfalls-3',
        img: './public/pictures/pice.jpeg',
        title: 'Victoria Falls Bridge',
        url: 'https://unsplash.com/photos/1591365497775-93d3e58a6a4c',
        height: 320
      },
      {
        id: 'vicfalls-4',
        img: './public/pictures/pic89.jpeg',
        title: 'Devil\'s Pool',
        url: 'https://unsplash.com/photos/1591025200553-8d4d5b4f504c',
        height: 400
      },
      {
        id: 'vicfalls-5',
        img: './public/pictures/pic45.jpeg',
        title: 'Falls Aerial View',
        url: 'https://unsplash.com/photos/1564574662336-88c7bdea1c8c',
        height: 360
      },
      {
        id: 'vicfalls-6',
        img: './public/pictures/pic78.jpeg',
        title: 'Zambezi River Sunset',
        url: 'https://unsplash.com/photos/1511317559916-56d5ddb625e8',
        height: 300
      },
    ]
  },
  
  // TO ADD A NEW TRIP: Just add a new key below
  hwange: {
    name: 'Hwange National Park',
    images: [
      {
        id: 'hwange-1',
        img: 'https://images.unsplash.com/photo-1550358864-518f202c02ba?w=800&auto=format&fit=crop',
        title: 'Hwange Elephants',
        url: 'https://unsplash.com/photos/1550358864-518f202c02ba',
        height: 400
      },
      {
        id: 'hwange-2',
        img: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop',
        title: 'Hwange Lions',
        url: 'https://unsplash.com/photos/1564349683136-77e08dba1ef7',
        height: 350
      },
      {
        id: 'hwange-3',
        img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop',
        title: 'Hwange Sunset',
        url: 'https://unsplash.com/photos/1546182990-dffeafbe841d',
        height: 380
      },
      {
        id: 'hwange-4',
        img: 'https://images.unsplash.com/photo-1577979749830-f1d742b9674f?w=800&auto=format&fit=crop',
        title: 'Hwange Waterhole',
        url: 'https://unsplash.com/photos/1577979749830-f1d742b9674f',
        height: 420
      },
    ]
  },
  
  // ANOTHER NEW TRIP EXAMPLE:
  matopos: {
    name: 'Matopos National Park',
    images: [
      {
        id: 'matopos-1',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
        title: 'Matopos Balancing Rocks',
        url: 'https://unsplash.com/photos/1506905925346-21bda4d32df4',
        height: 420
      },
      {
        id: 'matopos-2',
        img: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=800&auto=format&fit=crop',
        title: 'Matopos Sunset',
        url: 'https://unsplash.com/photos/1506260408121-e353d10b87c7',
        height: 380
      },
      {
        id: 'matopos-3',
        img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop',
        title: 'Matopos Hills',
        url: 'https://unsplash.com/photos/1518837695005-2083093ee35b',
        height: 350
      },
      {
        id: 'matopos-4',
        img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop',
        title: 'Matopos Viewpoint',
        url: 'https://unsplash.com/photos/1506929562872-bb421503ef21',
        height: 400
      },
    ]
  },
};

// Type definitions - matches your Masonry component props
type TripKey = keyof typeof TRIP_CONFIG | 'all';

interface MasonryItem {
  id: string;
  img: string;
  url: string;
  height: number;
  // Added for title display in overlay
  title?: string;
}

export default function ViewTripGallery() {
  const [selectedTrip, setSelectedTrip] = useState<TripKey>('kariba');
  const navigate = useNavigate();

  // Get all images from all trips for the "All Photos" view
  const allImages: MasonryItem[] = useMemo(() => {
    return Object.entries(TRIP_CONFIG).flatMap(([,tripData]) => 
      tripData.images.map(img => ({
        ...img,
        // Ensure it matches your Masonry item structure
        id: img.id,
        img: img.img,
        url: img.url,
        height: img.height,
        title: img.title // Keep title for potential use
      }))
    );
  }, []);

  // Get images for the selected trip
  const filteredImages: MasonryItem[] = useMemo(() => {
    if (selectedTrip === 'all') {
      return allImages;
    }
    return (TRIP_CONFIG[selectedTrip]?.images || []).map(img => ({
      ...img,
      id: img.id,
      img: img.img,
      url: img.url,
      height: img.height,
      title: img.title
    }));
  }, [selectedTrip, allImages]);

  // Get trip keys for tabs
  const tripKeys = Object.keys(TRIP_CONFIG) as (keyof typeof TRIP_CONFIG)[];

  const handleTabChange = (event: React.SyntheticEvent, newValue: TripKey) => {
    setSelectedTrip(newValue);
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1400, 
      margin: '0 auto',
      padding: { xs: 2, md: 3 },
      minHeight: '100vh'
    }}>
      {/* Back to Home Button */}
      <BackButton 
        variant="contained" 
        startIcon={<FaHome />} 
        onClick={handleBackToHome}
        sx={{ mb: 3 }}
      >
        Back to Home
      </BackButton>

      {/* Trip Tabs - Automatically generated from TRIP_CONFIG */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 4,
        overflowX: 'auto',
        '& .MuiTabs-scroller': {
          overflowX: 'auto !important'
        }
      }}>
        <Tabs 
          value={selectedTrip} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: -1 ,
              overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
          }}
          
        >
          {/* Auto-generate tabs for each trip */}
          {tripKeys.map((tripKey) => (
            <Tab 
              key={tripKey}
              label={TRIP_CONFIG[tripKey].name}
              value={tripKey}
              sx={{ 
                minWidth: 'auto', 
                px: 2,
                textTransform: 'none',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            />
          ))}
          
          {/* Add "All Photos" tab */}
          <Tab 
            label="All Photos" 
            value="all" 
            sx={{ 
              minWidth: 'auto', 
              px: 2,
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          />
        </Tabs>
      </Box>

      {/* Trip Info Header */}
      {selectedTrip !== 'all' && TRIP_CONFIG[selectedTrip] && (
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#333',
            fontWeight: 600,
            fontSize: '1.8rem'
          }}>
            {TRIP_CONFIG[selectedTrip].name}
          </h2>
          <p style={{ 
            color: '#666', 
            marginTop: '8px',
            fontSize: '0.95rem'
          }}>
            {filteredImages.length} photo{filteredImages.length !== 1 ? 's' : ''}
          </p>
        </Box>
      )}

      {/* Custom Masonry Gallery - Using your exact component */}
      <Box sx={{ 
        animation: 'fadeIn 0.3s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}>
        {filteredImages.length > 0 ? (
          <Box sx={{ position: 'relative', minHeight: '500px' }}>
            {/* This is your Masonry component with the exact props from your example */}
            <Masonry
              items={filteredImages}
              ease="power3.out"
              duration={0.6}
              stagger={0.03}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
              colorShiftOnHover={false}
            />
            
            {/* Custom overlay for titles - if your Masonry doesn't show titles */}
            {filteredImages.length > 0 && (
              <style>
                {`
                  /* Custom styles for image titles overlay */
                  .masonry-image-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.7));
                    color: white;
                    padding: 8px;
                    font-size: 0.85rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                  }
                  
                  .item-wrapper:hover .masonry-image-overlay {
                    opacity: 1;
                  }
                `}
              </style>
            )}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 10, 
            color: 'text.secondary',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
              No photos available for this trip yet.
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Add images to the TRIP_CONFIG for "{selectedTrip}"
            </p>
          </Box>
        )}
      </Box>

      
    </Box>
  );
}