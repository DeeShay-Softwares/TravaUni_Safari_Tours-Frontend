import { Theme } from "../assets/constants/colors";
import { typography } from "../assets/constants/typography";
import { Box, Typography, Collapse } from "@mui/material";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface ServicesTagsProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

interface TagItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const TAG_ITEMS: TagItem[] = [
  {
    id: "company-outings",
    title: "Company Outings",
    description: "Team-building retreats with curated experiences. Perfect for corporate groups looking to bond and create lasting memories in stunning natural settings."
  },
  {
    id: "group-getaways", 
    title: "Group Getaways", 
    description: "Perfect trips for friends and family adventures. Tailored group packages with activities for all ages and interests."
  },
  {
    id: "custom-vacations",
    title: "Custom Vacations",
    description: "Tailored journeys designed just for you. Work with our experts to create your dream vacation from scratch."
  },
  {
    id: "couple-gateways",
    title: "Couple Gateways",
    description: "Romantic escapes for memorable moments. Intimate settings, private accommodations, and special experiences for couples."
  }
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
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  margin: '10px 0',
};

// Tilted title box
const titleBoxStyle = {
  backgroundColor: Theme.bronze[500],
  color: Theme.wheat[200],
  padding: '8px 24px',
  borderRadius: '12px',
  display: 'inline-block',
  transform: 'rotate(-3deg)',
  marginBottom: '30px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  zIndex: 2,
};

// Original tag button style (updated for interactivity)
const tagButtonStyle = (isActive: boolean) => ({
  fontFamily: typography.fontFamily.primary,
  fontWeight: 700,
  color: isActive ? Theme.bronze[300] : Theme.wheat[100],
  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.12)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: `1px solid ${isActive ? Theme.bronze[400] : 'rgba(255, 255, 255, 0.2)'}`,
  borderRadius: '12px',
  padding: { xs: '10px 15px', md: '12px 20px' },
  fontSize: {
    xs: "0.95rem",
    sm: "1rem",
    md: "1.1rem",
  },
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    color: Theme.bronze[300],
    borderColor: Theme.bronze[400],
  },
  '&:active': {
    transform: 'translateY(-1px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: isActive 
      ? `linear-gradient(135deg, ${Theme.bronze[500]}15, ${Theme.bronze[300]}10)` 
      : 'transparent',
    zIndex: -1,
  }
});

// Description panel style
const descriptionPanelStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '0 0 12px 12px',
  borderTop: 'none',
  marginTop: '-1px',
  padding: { xs: '20px', md: '24px 28px' },
  boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.1)',
};

// Description text style
const descriptionTextStyle = {
  fontFamily: typography.fontFamily.primary,
  fontWeight: typography.inputText.fontWeight,
  color: Theme.wheat[200],
  fontSize: {
    xs: "0.95rem",
    md: "1.05rem",
  },
  lineHeight: 1.6,
  opacity: 0.95,
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
};

// Chevron icon style
const chevronIconStyle = {
  fontSize: '1.2rem',
  transition: 'transform 0.3s ease',
  flexShrink: 0,
};

export function ServicesTags({ title, subtitle }: ServicesTagsProps) {
  const [activeTagId, setActiveTagId] = useState<string | null>(null);

  const handleTagClick = (tagId: string) => {
    if (activeTagId === tagId) {
      setActiveTagId(null);
    } else {
      setActiveTagId(tagId);
    }
  };

  const getActiveDescription = () => {
    const activeTag = TAG_ITEMS.find(tag => tag.id === activeTagId);
    return activeTag ? activeTag.description : '';
  };

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
      
      {/* Interactive Tags */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: { xs: '12px', md: '16px' },
        width: '100%',
        mb: 2,
      }}>
        {TAG_ITEMS.map((tag) => {
          const isActive = activeTagId === tag.id;
          return (
            <Box
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              sx={tagButtonStyle(isActive)}
            >
              <Typography sx={{ pointerEvents: 'none' }}>
                {tag.title}
              </Typography>
              <Box sx={chevronIconStyle}>
                {isActive ? <BiChevronUp /> : <BiChevronDown />}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Animated Description Panel */}
      <Collapse in={!!activeTagId} timeout={400}>
        <Box sx={descriptionPanelStyle}>
          <Typography sx={descriptionTextStyle}>
            {getActiveDescription()}
          </Typography>
          
          
          {/* {activeTagId && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 3,
              gap: 2,
            }}>
              <Box
                sx={{
                  backgroundColor: Theme.bronze[500],
                  color: Theme.bronze[100],
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: Theme.bronze[600],
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(186, 143, 89, 0.3)',
                  }
                }}
              >
                <BiChevronRight />
                Explore {TAG_ITEMS.find(t => t.id === activeTagId)?.title}
              </Box>
            </Box>
          )} */}
        </Box>
      </Collapse>

      {/* Instructional text when no tag is selected */}
      {!activeTagId && (
        <Box sx={{ 
          textAlign: 'center', 
          mt: 3,
          opacity: 0.7,
        }}>
          <Typography sx={{
            fontFamily: typography.fontFamily.primary,
            fontWeight: 400,
            color: Theme.wheat[200],
            fontSize: '0.95rem',
            fontStyle: 'italic',
          }}>
            Click on any service above to learn more
          </Typography>
        </Box>
      )}
    </Box>
  );
}