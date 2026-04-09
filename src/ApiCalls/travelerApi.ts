import { travelerApi } from '@/lib/apiClient';
import type { AxiosResponse } from 'axios';


// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateTravelerPayload {
  fullName:    string;
  age:         string;
  gender:      'male' | 'female' | 'other' | 'prefer-not-to-say';
  idNumber:    string;
  idType:      'passport' | 'national-id' | 'driver-license';
  nationality: string;
  dateOfBirth: string;
  isStudent:   boolean;
  schoolName?: string;
  email?:      string;
}

export interface TravelerResponse {
  _id:             string;
  fullName:        string;
  age:             string;
  gender:          'male' | 'female' | 'other' | 'prefer-not-to-say';
  idNumber:        string;
  idType:          'passport' | 'national-id' | 'driver-license';
  nationality:     string;
  dateOfBirth:     string;
  isStudent:       boolean;
  schoolName?:     string;
  bookingHistory?: Array<{
    _id:           string;
    bookingNumber: string;
    status:        string;
    totalPrice:    number;
  }>;
  createdAt?:      string;
  updatedAt?:      string;
}

export interface TravelerExistsData {
  _id:         string;
  fullName:    string;
  idNumber:    string; // partial — last 4 digits only
  nationality: string;
  age:         string;
}

export interface CheckTravelerExistsResult {
  exists: boolean;
  data?:  TravelerExistsData;
}

export interface TravelerExistsError extends Error {
  code:         'TRAVELER_EXISTS';
  existingData: TravelerExistsData;
}

export interface TravelerListResponse {
  data: TravelerResponse[];
  pagination: {
    page:  number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a traveler exists by email or ID number.
 * Returns minimal data to prevent information leaks.
 */
export const checkTravelerExists = async (
  email?:    string,
  idNumber?: string,
): Promise<CheckTravelerExistsResult> => {
  const params = new URLSearchParams();
  if (email)    params.append('email',    email);
  if (idNumber) params.append('idNumber', idNumber);

  const response: AxiosResponse<{
    success: boolean;
    exists:  boolean;
    data?:   TravelerExistsData;
  }> = await travelerApi.get(`/travelers/check-exists?${params}`);

  return { exists: response.data.exists, data: response.data.data };
};

/**
 * Create a new traveler (called during booking flow).
 *
 * @param data         - Traveler information
 * @param forceCreate  - When true, skips the duplicate check entirely.
 *                       Use this when the user explicitly chose "Create New Profile"
 *                       after being told an existing profile was found.
 *
 * If forceCreate is false (default) and a traveler with the same email / ID
 * number already exists, throws a TravelerExistsError so the UI can prompt
 * the user to choose between the existing profile and a new one.
 */
export const createTraveler = async (
  data:          CreateTravelerPayload,
  forceCreate =  false,
): Promise<TravelerResponse> => {
  if (!forceCreate) {
    const checkResult = await checkTravelerExists(data.email, data.idNumber);

    if (checkResult.exists && checkResult.data) {
      const error = new Error('Traveler already exists') as TravelerExistsError;
      error.code         = 'TRAVELER_EXISTS';
      error.existingData = checkResult.data;
      throw error;
    }
  }

  const response: AxiosResponse<{ success: boolean; data: TravelerResponse }> =
    await travelerApi.post('/travelers/create', data);

  return response.data.data;
};

/**
 * Get a traveler's full record by their ID number.
 * Used after the user selects "Use Existing Profile" so we can obtain the
 * real MongoDB _id before creating the booking.
 */
export const getTravelerByIdNumber = async (idNumber: string): Promise<TravelerResponse> => {
  const response: AxiosResponse<{ success: boolean; data: TravelerResponse }> =
    await travelerApi.get(`/travelers/by-idnumber/${encodeURIComponent(idNumber)}`);

  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ENDPOINTS (Admin only)
// ─────────────────────────────────────────────────────────────────────────────

export const getAllTravelers = async (filters?: {
  page?:        number;
  limit?:       number;
  search?:      string;
  nationality?: string;
  isStudent?:   boolean;
}): Promise<TravelerListResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
  }

  const response: AxiosResponse<{
    success:    boolean;
    data:       TravelerResponse[];
    pagination: TravelerListResponse['pagination'];
  }> = await travelerApi.get(`/travelers?${params}`);

  return { data: response.data.data, pagination: response.data.pagination };
};

export const getTravelerById = async (id: string): Promise<TravelerResponse> => {
  const response: AxiosResponse<{ success: boolean; data: TravelerResponse }> =
    await travelerApi.get(`/travelers/${id}`);

  return response.data.data;
};

export const updateTraveler = async (
  id:   string,
  data: Partial<CreateTravelerPayload>,
): Promise<TravelerResponse> => {
  const response: AxiosResponse<{ success: boolean; data: TravelerResponse }> =
    await travelerApi.put(`/travelers/${id}`, data);

  return response.data.data;
};

export const deleteTraveler = async (id: string): Promise<void> => {
  await travelerApi.delete(`/travelers/${id}`);
};

export const addBookingToHistory = async (
  travelerId: string,
  bookingId:  string,
): Promise<TravelerResponse> => {
  const response: AxiosResponse<{ success: boolean; data: TravelerResponse }> =
    await travelerApi.post('/travelers/add-booking', { travelerId, bookingId });

  return response.data.data;
};

export const getTravelerBookings = async (id: string): Promise<{
  traveler:      { _id: string; fullName: string; idNumber: string };
  bookings:      unknown[];
  totalBookings: number;
}> => {
  const response: AxiosResponse<{ success: boolean; data: unknown }> =
    await travelerApi.get(`/travelers/${id}/bookings`);

  return response.data.data as {
    traveler:      { _id: string; fullName: string; idNumber: string };
    bookings:      unknown[];
    totalBookings: number;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const TravelerServices = {
  // Public
  checkTravelerExists,
  createTraveler,
  getTravelerByIdNumber,
  // Admin
  getAllTravelers,
  getTravelerById,
  updateTraveler,
  deleteTraveler,
  addBookingToHistory,
  getTravelerBookings,
};

export default TravelerServices;