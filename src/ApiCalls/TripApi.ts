import { tripApi } from "@/lib/apiClient";

// Create a new trip
const createTrip = async (data: object) => {
  try {
    const response = await tripApi.post("/create", data);
    return response;
  } catch (error) {
    console.error("Error creating trip", error);
    throw error;
  }
};

// Get all trips
const getAllTrips = async () => {
  try {
    const response = await tripApi.get("/");
    return response;
  } catch (error) {
    console.error("Error getting trips", error);
    throw error;
  }
};

// Get single trip by ID
const getTripById = async (id: string) => {
  try {
    const response = await tripApi.get(`/${id}`);
    return response;
  } catch (error) {
    console.error("Error getting trip", error);
    throw error;
  }
};

// Update a trip
const updateTrip = async (id: string, tripData: object) => {
  try {
    const response = await tripApi.put(`/${id}`, tripData);
    return response.data;
  } catch (error) {
    console.error("Error updating trip", error);
    throw error;
  }
};

// Delete a trip
const deleteTrip = async (id: string) => {
  try {
    const response = await tripApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting trip", error);
    throw error;
  }
};

// Search trips
const searchTrips = async (query: string) => {
  try {
    const response = await tripApi.get(`/search?q=${query}`);
    return response;
  } catch (error) {
    console.error("Error searching trips", error);
    throw error;
  }
};

// Get trips by location
const getTripsByLocation = async (location: string) => {
  try {
    const response = await tripApi.get(`/location/${location}`);
    return response;
  } catch (error) {
    console.error("Error getting trips by location", error);
    throw error;
  }
};

// Get featured trips
const getFeaturedTrips = async () => {
  try {
    const response = await tripApi.get("/featured");
    return response;
  } catch (error) {
    console.error("Error getting featured trips", error);
    throw error;
  }
};

// Update trip status
const updateTripStatus = async (id: string, status: string) => {
  try {
    const response = await tripApi.patch(`/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating trip status", error);
    throw error;
  }
};

// Get trips with filters (status, featured, price range, etc.)
const getFilteredTrips = async (filters: object) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await tripApi.get(`/?${queryParams.toString()}`);
    return response;
  } catch (error) {
    console.error("Error getting filtered trips", error);
    throw error;
  }
};

// Bulk delete trips
const bulkDeleteTrips = async (tripIds: string[]) => {
  try {
    const response = await tripApi.post("/bulk-delete", { tripIds });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting trips", error);
    throw error;
  }
};

// Get trip statistics
const getTripStats = async () => {
  try {
    const response = await tripApi.get("/stats");
    return response;
  } catch (error) {
    console.error("Error getting trip stats", error);
    throw error;
  }
};

const TripServices = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  searchTrips,
  getTripsByLocation,
  getFeaturedTrips,
  updateTripStatus,
  getFilteredTrips,
  bulkDeleteTrips,
  getTripStats,
};

export default TripServices;