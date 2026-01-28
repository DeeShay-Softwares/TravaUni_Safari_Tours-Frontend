import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material";
import { FiUser, FiLock ,FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";



interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleLoginButton = ()=>{
    navigate('/admin', {
        replace: true
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          p: 1,
        },
      }}
    >

 <IconButton 
              onClick={onClose} 
              size="small"
              sx={{ 
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }}
            >
              <FiX />
            </IconButton>

      <DialogTitle textAlign="center" fontWeight={600}>
        Admin Login
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            placeholder="Enter admin username"
            InputProps={{
              startAdornment: (
                <Box mr={1} color="text.secondary">
                  <FiUser />
                </Box>
              ),
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter password"
            InputProps={{
              startAdornment: (
                <Box mr={1} color="text.secondary">
                  <FiLock />
                </Box>
              ),
            }}
          />

         
          <Button
            fullWidth
            variant="contained"
            onClick={()=> handleLoginButton()}
            size="large"
            sx={{
              mt: 1,
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Button>

         
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mt={1}
          >
            🔒 This login is restricted to administrators only.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
