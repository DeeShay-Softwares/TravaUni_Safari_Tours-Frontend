// ApiCalls/BookingApi.ts
import type { AxiosResponse } from 'axios';
import { bookingApi } from '@/lib/apiClient';
import type { TravelerResponse } from './travelerApi';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  contactEmail:          string;
  contactPhone:          string;
  mainTravelerId:        string;
  additionalTravelerIds: string[];
  tripId:                string;
  travelDates:           { start: string; end: string };
  totalPrice:            number;
  specialRequests?:      string;
}

export interface PopulatedTrip {
  _id:       string;
  title:     string;
  location:  string;
  startDate: string;
  endDate:   string;
  price:     number;
}

export interface BookingResponse {
  _id:                   string;
  bookingNumber:         string;
  status:                'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus:         'pending' | 'partial' | 'completed' | 'refunded';
  contactEmail:          string;
  contactPhone:          string;
  mainTravelerId:        TravelerResponse;
  additionalTravelerIds: TravelerResponse[];
  tripId:                PopulatedTrip;
  travelDates:           { start: string; end: string };
  totalPrice:            number;
  currency:              string;
  specialRequests?:      string;
  bookingDate:           string;
  createdAt:             string;
  updatedAt:             string;
}

export interface BookingListResponse {
  data:        BookingResponse[];
  total:       number;
  pages:       number;
  pagination?: {
    page:  number;
    limit: number;
    total: number;
    pages: number;
  };
}

export type PaymentStatusUpdate = {
  paymentStatus:     'partial' | 'completed' | 'refunded';
  paymentReference?: string;
  paidAmount?:       number;
  paymentMethod?:    string;
};

/**
 * Shape of the error body returned by POST /bookings/create when a traveler
 * is already booked for the same trip (HTTP 409).
 * The axios error exposes this as:  err.response.data
 */
export interface AlreadyBookedErrorBody {
  success:         false;
  code:            'TRAVELER_ALREADY_BOOKED';
  message:         string;
  existingBooking: {
    travelerName:  string;
    travelerEmail: string;
    tripTitle:     string;
    bookingNumber: string;
    bookingDate:   string;
    status:        string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

export const createBooking = async (data: CreateBookingPayload): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.post('/bookings/create', data);

  return response.data.data;
};

export const getBookingByNumber = async (bookingNumber: string): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.get(`/bookings/number/${bookingNumber}`);

  return response.data.data;
};

export const updatePaymentStatus = async (
  bookingId: string,
  data:      PaymentStatusUpdate,
): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.patch(`/bookings/${bookingId}/payment`, data);

  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROTECTED ENDPOINTS (Admin only)
// ─────────────────────────────────────────────────────────────────────────────

export const getAllBookings = async (filters?: {
  status?:        string;
  paymentStatus?: string;
  tripId?:        string;   // raw ObjectId — for admin table filters
  tripTitle?:     string;   // human-readable title — for TripPreviewPage
  search?:        string;
  page?:          number;
  limit?:         number;
}): Promise<BookingListResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
  }

  const response: AxiosResponse<{
    success:    boolean;
    data:       BookingResponse[];
    total:      number;
    pages:      number;
    pagination: BookingListResponse['pagination'];
  }> = await bookingApi.get(`/bookings?${params}`);

  return {
    data:       response.data.data,
    total:      response.data.total,
    pages:      response.data.pages,
    pagination: response.data.pagination,
  };
};

export const confirmBooking = async (bookingId: string): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.patch(`/bookings/${bookingId}/status`, { status: 'confirmed' });

  return response.data.data;
};

export const cancelBooking = async (bookingId: string): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });

  return response.data.data;
};

export const getBookingById = async (id: string): Promise<BookingResponse> => {
  const response: AxiosResponse<{ success: boolean; data: BookingResponse }> =
    await bookingApi.get(`/bookings/${id}`);

  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const BookingServices = {
  // Public
  createBooking,
  getBookingByNumber,
  updatePaymentStatus,
  // Admin
  getAllBookings,
  confirmBooking,
  cancelBooking,
  getBookingById,
};

export default BookingServices;