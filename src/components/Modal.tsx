'use client';

import React, { useEffect } from 'react';
import type { ReactNode} from 'react'
import {
  Dialog,
  IconButton,
  Box,
  styled,
  Slide,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { MdClose, MdFullscreen, MdFullscreenExit } from 'react-icons/md';

// Styled Components
const ModalContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
}));

const ModalTitle = styled('h2')(({ theme }) => ({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  position: 'relative',
}));

// Slide + Fade Transition
const SlideFadeTransition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      <Fade in={true}>{props.children}</Fade>
    </Slide>
  );
});

// Props Interface
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disableBackdropClick?: boolean;
  showCloseButton?: boolean;
  fullScreenControl?: boolean;
  maxWidth?: number | string;
  padding?: number;
  keepMounted: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  disableBackdropClick = false,
  showCloseButton = true,
  fullScreenControl = true,
  padding = 3,
  keepMounted = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleClose = (reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    onClose();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Determine actual fullscreen state (fullscreen on mobile or when explicitly toggled)
  const fullScreen = isFullScreen || isMobile;
  
  // Size mapping
  const getSize = () => {
    if (fullScreen) return { width: '100vw', height: '100vh', margin: 0 };
    
    const sizes = {
      sm: { width: 400, maxWidth: '90vw' },
      md: { width: 600, maxWidth: '90vw' },
      lg: { width: 800, maxWidth: '90vw' },
      xl: { width: 1140, maxWidth: '90vw' },
      full: { width: '90vw', height: '90vh' },
    };
    
    return sizes[size] || sizes.md;
  };

  return (
    <Dialog
    keepMounted = {keepMounted}
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={SlideFadeTransition}
      maxWidth={false}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          ...getSize(),
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: fullScreen ? 0 : 1,
          transition: 'all 0.3s ease',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <ModalContainer>
        {(title || showCloseButton || fullScreenControl) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
              {fullScreenControl && !isMobile && (
                <IconButton
                  onClick={toggleFullScreen}
                  size="small"
                  title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullScreen ? (
                    <MdFullscreenExit size={20} />
                  ) : (
                    <MdFullscreen size={20} />
                  )}
                </IconButton>
              )}
              
              {showCloseButton && (
                <IconButton
                  onClick={onClose}
                  size="small"
                  title="Close"
                >
                  <MdClose size={20} />
                </IconButton>
              )}
            </Box>
          </ModalHeader>
        )}
        
        <ModalContent sx={{ p: padding }}>
          {children}
        </ModalContent>
      </ModalContainer>
    </Dialog>
  );
};

export default CustomModal;