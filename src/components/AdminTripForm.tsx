import React, { useState, useEffect,useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { colors } from "../assets/constants/theme";
import type { TripInput, AdminTripFormProps } from "@/types";
import TripServices from "@/ApiCalls/TripApi";

const AdminTripForm: React.FC<AdminTripFormProps> = ({
  formMode,
  trip,
  onCancel,
  onSuccess,
  loading: externalLoading = false, // Rename to avoid conflict
}) => {
  const initialState: TripInput = {
    title: "",
    location: "",
    price: 0,
    startDate: "",
    endDate: "",
    image: "",
    description: "",
  };

  const [formData, setFormData] = useState<TripInput>(() => {
    if (trip) {
      return {
        title: trip.title || "",
        location: trip.location || "",
        price: trip.price || 0,
        startDate: trip.startDate || "",
        endDate: trip.endDate || "",
        image: trip.image || "",
        description: trip.description || "",
      };
    }
    return initialState;
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [internalLoading, setInternalLoading] = useState(false); // Add internal loading state
  
  
  // FIX 1: Remove unused setTrip state
  // const [setTrip] = useState(null); - REMOVED

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Trip name required";
    if (!formData.location.trim()) newErrors.location = "Location required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.startDate) newErrors.startDate = "Start date required";
    if (!formData.endDate) newErrors.endDate = "End date required";
    if (!formData.image.trim()) newErrors.image = "Image URL required";
    if (!formData.description.trim())
      newErrors.description = "Description required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isEditing = formMode === "edit" // If ID exists in URL, we're editing

  const fetchTripData = useCallback(async () => {
    setInternalLoading(true); // FIX 2: Use setInternalLoading, not loading(true)
    try {
      const response = await TripServices.getTripById(trip?.title || "");
      const tripData = response.data.data;
      
      // FIX 3: Update form data with all fields from response
      setFormData({
        title: tripData.title || "",
        description: tripData.description || "",
        location: tripData.location || "",
        price: tripData.price || 0,
        startDate: tripData.startDate || "",
        endDate: tripData.endDate || "",
        image: tripData.image || "",
      });
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setInternalLoading(false);
    }
  }, [trip?.title]);

  useEffect(() => {
    // If editing, fetch the trip data
    if (isEditing) {
      fetchTripData();
    }
  }, [isEditing, fetchTripData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setInternalLoading(true); // FIX 4: Set loading true before API call
    
    try {
      let response;
      
      if (isEditing && trip) {
        // FIX 5: Call updateTrip when editing
        response = await TripServices.updateTrip(trip.title, formData);
        console.log("Trip updated successfully", response);
      } else if(formMode === "create") {
        // Call createTrip when creating
        response = await TripServices.createTrip(formData);
        console.log("Trip created successfully", response);
      }
      
      onCancel(); // Close the form after successful submission
      if (onSuccess) {
      onSuccess(); // Call success callback to refresh list
    }
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setInternalLoading(false); // FIX 6: Set loading false after API call
    }
  };

  // FIX 7: Combine external and internal loading
  const isLoading = externalLoading || internalLoading;

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        border: `1px solid ${colors.darkKhakhi[200]}`,
        maxWidth: 800,
        mx: "auto",
        position: "relative",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        sx={{ color: colors.darkKhakhi[900] }}
      >
        {/* FIX 8: Use isEditing instead of trip prop */}
        {isEditing ? "Edit Trip" : "Create Trip"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gap: 3,
          }}
        >
          <TextField
            label="Trip Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            InputProps={{ sx: { borderRadius: 2 } }}
            disabled={isLoading}
          />

          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            InputProps={{ sx: { borderRadius: 2 } }}
            disabled={isLoading}
          />

          <TextField
            label="Price (USD)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            fullWidth
            InputProps={{
              inputProps: { min: 0 },
              sx: { borderRadius: 2 },
            }}
            disabled={isLoading}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2 } }}
              disabled={isLoading}
            />

            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2 } }}
              disabled={isLoading}
            />
          </Box>

          <TextField
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={!!errors.image}
            helperText={errors.image}
            fullWidth
            InputProps={{ sx: { borderRadius: 2 } }}
            disabled={isLoading}
          />

          {formData.image && (
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <img
                src={formData.image}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            fullWidth
            InputProps={{ sx: { borderRadius: 2 } }}
            disabled={isLoading}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              onClick={onCancel}
              variant="outlined"
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                borderColor: colors.darkKhakhi[300],
                color: colors.darkKhakhi[700],
                "&:hover": {
                  borderColor: colors.darkKhakhi[400],
                  backgroundColor: colors.darkKhakhi[50],
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                borderRadius: 2,
                backgroundColor: colors.oliveWood[500],
                "&:hover": {
                  backgroundColor: colors.oliveWood[600],
                },
                "&:disabled": {
                  backgroundColor: colors.darkKhakhi[300],
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} />
              ) : isEditing ? ( // FIX 9: Use isEditing for button text
                "Update Trip"
              ) : (
                "Create Trip"
              )}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default AdminTripForm;