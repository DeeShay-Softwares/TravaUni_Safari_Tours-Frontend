import {
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  styled,
} from '@mui/material';



interface ImageItem {
  id: number;
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  images?: ImageItem[];
}

const defaultImages: ImageItem[] = [
  {
    id: 1,
    src: './public/pictures/pic1.jpeg',
       alt: 'Mountain landscape',
  },
  {
    id: 2,
    src: './public/pictures/pic2.jpeg',
      alt: 'Tropical beach',
  },
  {
    id: 3,
    src: './public/pictures/pic3.jpeg',
      alt: 'Forest trail',
  },
  {
    id: 4,
    src: './public/pictures/pic4.jpeg',
        alt: 'Northern lights',
  },
  {
    id: 5,
    src: './public/pictures/pic5.jpeg',
      alt: 'City skyline',
  },
  {
    id: 6,
    src:   './public/pictures/pic6.jpeg',
     alt: 'Desert dunes',
  },
  {
    id: 7,
    src: './public/pictures/pic8.jpeg',
      alt: 'Mountain lake',
  },
  {
    id: 8,
    src: './public/pictures/pic9.jpeg',
      alt: 'Waterfall',
  },
];

const GalleryImage = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  width: '120px',
  height: '120px',
  flexShrink: 0,
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: theme.shadows[4],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '   50px',
  },
}));

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = defaultImages,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 

  

  return (
    <Box sx={{ width: isMobile? '60%':'100%', position: 'relative', px: { xs: 2, sm: 0 } }}>

      {/* Scrollable Image Container */}
      <Box
        sx={{
          display: 'flex',
         flexDirection: isMobile?  'row':'column',
          overflowX: 'auto',
          gap: 3,
          py: 3,
          px: 1,
         height: isMobile ? '120px' : '350px',
       overflowY: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
  }}
      
      >
        {images.map((image) => (
          <GalleryImage
            key={image.id}
            sx={{
              backgroundImage: `url(${image.src})`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageGallery;