import { Paper, Box, Avatar, Typography } from "@mui/material";
import { FaDotCircle } from "react-icons/fa";
import { colors } from "@/assets/constants/theme";
import "../App.css";

interface ProfileProps {
  avatar?: string; // Changed from typeof Avatar to string for image URL
  status: "Active" | "Inactive" | string; // Added specific status options
  name: string;
  variant?: "compact" | "full"; // Optional variant for different layouts
}

export const AdminDashboardProfile = ({
  avatar,
  status,
  name,
  variant = "full",
}: ProfileProps) => {
  const getStatusColor = (status: string): string => {
    const statusColors = {
      Active: colors.oliveWood[500] || "#4caf50",
      Inactive: colors.bronze[500] || "#9e9e9e",
    };

    return (
      statusColors[status as keyof typeof statusColors] ||
      colors.oliveWood?.[400] ||
      "#9e9e9e"
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: variant === "compact" ? "auto" : "60%",
        minWidth: "250px",
        padding: "15px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[24],
        },
        mb: 1,
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Avatar
          src={avatar}
          alt={name}
          sx={{
            width: variant === "compact" ? 40 : 56,
            height: variant === "compact" ? 40 : 56,
            border: `2px solid ${getStatusColor(status)}`,
          }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0, // Prevents text overflow
        }}
      >
        <Typography
          variant={variant === "compact" ? "body1" : "h6"}
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "text.secondary",
          }}
        >
          <FaDotCircle color={getStatusColor(status)} />
          <span style={{ textTransform: "capitalize" }}>{status}</span>
        </Typography>
      </Box>
    </Paper>
  );
};
