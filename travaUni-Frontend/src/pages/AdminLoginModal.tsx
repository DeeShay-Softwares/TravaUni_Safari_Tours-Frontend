import React, { useState } from "react";
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
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { FiUser, FiLock, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AuthServices from "@/ApiCalls/AdminAuth";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const { login } = useAuth();

  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await AuthServices.login(username, password);

      if (response.token) {
        login(
          response.token,
          response.user || {
            // User object from backend
            id: response.user?.id,
            username: response.user?.username || username,
            role: response.user?.role || "admin",
            name: response.user?.name || response.user?.fullname || username,
          },
        );
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        onClose();

        navigate("/admin", {
          replace: true,
        });

        console.log("Login successful, token stored");
      } else if (response.success) {
        // Fallback for older API structure
        login(response.token, response.user);
        onClose();
        navigate("/admin", { replace: true });
      } else if (response.status === 401) {
        // Handle error response
        setError("Invalid credentials. Please try again.");
      } else if (response.status === 429) {
        setError("Too. Try again after 30 minutes");
      }
    } catch (error) {
      let errorMessage = "";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;

        const statusCode = axiosError.response?.status || 500;

        if (statusCode === 401) {
          errorMessage = "Invalid credentials. Please try again.";
        } else if (statusCode === 429) {
          errorMessage = "Too many attempts. Try again after 30 minutes";
        } else {
          errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            "Login failed. Please try again.";
        }
        setError(errorMessage);

        console.error("Login error:", errorMessage);
        //throw new ApiError(message, statusCode, data);
      } else {
        errorMessage = "An unknown error occurred";
        setError(errorMessage);
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(0,0,0,0.05)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <FiX />
        </IconButton>
      </Box>

      <DialogTitle textAlign="center" fontWeight={600}>
        Admin Login
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Username Field */}
          <TextField
            fullWidth
            label="Username"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            error={!!error}
            InputProps={{
              startAdornment: (
                <Box mr={1} color="text.secondary">
                  <FiUser />
                </Box>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            error={!!error}
            InputProps={{
              startAdornment: (
                <Box mr={1} color="text.secondary">
                  <FiLock />
                </Box>
              ),
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            size="large"
            sx={{
              mt: 1,
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              position: "relative",
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          {/* Footer Text */}
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
