import { Theme } from "../assets/constants/theme";
import { typography } from "../assets/constants/typography";
import { Box, Typography } from "@mui/material";

interface ServicesTagsProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const TAGS = [
  "company outings",
  "group getaways", 
  "custom vacations",
  "couple gateways"
];

// Main glassy container
const glassyContainer = {
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  padding: { xs: '20px', md: '30px 40px' },
  maxWidth: '900px',
  margin: ' 10px 20px',
  marginRight: '30px',
  position: 'relative',
  overflow: 'hidden',
};

// Tilted title box (like in your image)
const titleBoxStyle = {
  backgroundColor: Theme.bronze[500],
  color: Theme.wheat[200],
  padding: '8px 20px',
  borderRadius: '12px',
  display: 'inline-block',
  transform: 'rotate(-3deg)',
  marginBottom: '25px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  zIndex: 2,
};

// Glassy tag style
const tagStyles = {
  fontFamily: typography.fontFamily.primary,
  fontWeight: typography.heroSubtitle.fontWeight,
  color: Theme.wheat[100],
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '10px',
  padding: '8px 20px',
  fontSize: {
    xs: "0.9rem",
    sm: "1rem",
    md: typography.inputText.fontSize,
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
};

export function ServicesTags({ title, subtitle }: ServicesTagsProps) {
  return (
    <Box sx={glassyContainer}>
       
      {/* Title section with tilt effect */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        {title && (
          <Box sx={titleBoxStyle}>
            <Typography 
              sx={{
                fontFamily: typography.fontFamily.primary,
                fontWeight: 800,
                fontSize: {
                  xs: "1.4rem",
                  sm: "1.6rem",
                  md: "1.8rem",
                },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {title}
            </Typography>
          </Box>
        )}
        
        {/* Subtitle */}
        {subtitle && (
          <Typography 
            sx={{
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.heroTitle.fontWeight,
              color: Theme.wheat[100],
              fontSize: {
                xs: "1.1rem",
                md: "1.4rem",
              },
              lineHeight: 1.5,
              opacity: 0.95,
              mt: 2,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {/* Tags section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '15px',
      }}>
        {TAGS.map((tag, index) => (
          <Typography
            key={index}
            sx={tagStyles}
          >
            {tag}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}