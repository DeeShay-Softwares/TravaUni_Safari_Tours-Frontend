import { Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { typography } from '../assets/constants/typography';
import { Theme } from '../assets/constants/colors';
import type React from 'react';

interface GlassyButtonProps {
  title: string;
  highlight: string;
  onClick?: () => void;
  height?: string | number;
  width?: string | number;
  background?: string;
  sx?: React.CSSProperties;
}

interface StyledButtonProps {
  height?: string | number;
  width?: string | number;
  background?: string;
}

const GlassButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'height' && prop !== 'width' && prop !== 'background' ,
})<StyledButtonProps>(({ theme, height, width, background }) => ({
  padding: theme.spacing(3, 6),
  borderRadius: 999,
  textTransform: 'none',
  background: background ||'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
  color: Theme.wheat[200],
  transition: 'all 0.3s ease',
  height: height || 'auto',
  width: width || 'auto',
  minHeight: '56px', // Ensure minimum height for accessibility
  minWidth: '140px', // Ensure minimum width for accessibility

  '&:hover': {
    background: 'rgba(0, 0, 0, 0.6)',
    boxShadow: '0 12px 50px rgba(0, 0, 0, 0.8)',
  },
}));

export const GlassyButton = ({
  title,
  highlight,
  onClick,
  height,
  width,
  background,
  sx
}: GlassyButtonProps) => {
  return (
    <GlassButton 
      onClick={onClick} 
      height={height} 
      width={width}
      background={background}
      sx={sx}
    >
      <Typography
        component="span"
        sx={{
          fontSize: { xs: '0.8rem', md: '1.2rem' },
          fontWeight: typography.sectionTitle.fontWeight,
          whiteSpace: 'nowrap',
        }}
      >
        {title}{' '}
        <Typography
          component="span"
          sx={{
            color: Theme.bronze[400],
            fontWeight: 600,
          }}
        >
          {highlight}
        </Typography>
      </Typography>
    </GlassButton>
  );
};