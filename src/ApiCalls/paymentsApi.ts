// ApiCalls/PaymentApi.ts
import { paymentApi } from '@/lib/apiClient';
import type { AxiosResponse } from 'axios';

// No auth needed — payment endpoints are public (travelers have no token)

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface InitiatePaymentPayload {
  bookingId:        string;
  amountPaid:       number;
  paymentMethod:    'airtel' | 'mtn' | 'zamtel' | 'card' | 'bank' | 'cash';
  mobileNumber?:    string;
  paymentReference: string;
}

export interface PaymentResponse {
  _id:              string;
  bookingId:        string;
  bookingNumber:    string;
  amountPaid:       number;
  currency:         string;
  paymentType:      'reservation' | 'balance' | 'full';
  totalBookingCost: number;
  paymentMethod:    string;
  paymentReference: string;
  gatewayResponse?: string;
  gatewayTxId?:     string;
  status:           'initiated' | 'pending' | 'completed' | 'failed' | 'refunded';
  initiatedAt:      string;
  completedAt?:     string;
  createdAt:        string;
  updatedAt:        string;
}

export interface ConfirmPaymentPayload {
  paymentReference:  string;
  gatewayTxId?:      string;
  gatewayResponse?:  string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Step 1 — called when the user taps "Complete Booking".
 * Creates the Payment record and triggers the MOMO prompt on the backend.
 */
export const initiatePayment = async (
  data: InitiatePaymentPayload,
): Promise<PaymentResponse> => {
  const response: AxiosResponse<{ success: boolean; data: PaymentResponse }> =
    await paymentApi.post('/initiate', data);
  return response.data.data;
};

/**
 * Called when the user clicks "Cancel Booking" after a payment failure and
 * does NOT want to retry. Deletes the booking and all its failed payment
 * records from the database entirely.
 *
 * Do NOT call this on the retry path — use markBookingPaymentFailed instead.
 */
export const cancelAndDeleteBooking = async (
  bookingId: string,
): Promise<void> => {
  await paymentApi.delete(`/cancel-booking/${bookingId}`);
};

/**
 * Called by the frontend when polling times out or ZynlePay rejects the payment.
 * Marks the booking status = 'payment_failed' so:
 *   - Admins can see it is not a ghost pending booking.
 *   - The user can retry payment against the same bookingId without creating a duplicate.
 */
export const markBookingPaymentFailed = async (
  bookingId: string,
): Promise<void> => {
  await paymentApi.patch(`/fail-booking/${bookingId}`);
};

/**
 * Manual confirmation fallback — admin use only.
 * In production the webhook handles this automatically.
 */
export const confirmPayment = async (
  data: ConfirmPaymentPayload,
): Promise<PaymentResponse> => {
  const response: AxiosResponse<{ success: boolean; data: PaymentResponse }> =
    await paymentApi.post('/confirm', data);
  return response.data.data;
};

/**
 * Polled by the frontend every 5 s while waiting for MOMO confirmation.
 * Returns all payments for the booking so the frontend can check for
 * status = 'completed' or 'failed'.
 */
export const getPaymentsByBooking = async (
  bookingId: string,
): Promise<PaymentResponse[]> => {
  const response: AxiosResponse<{ success: boolean; data: PaymentResponse[] }> =
    await paymentApi.get(`/booking/${bookingId}`);
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique payment reference on the frontend.
 * Format:  PAY-{bookingNumber}-{timestamp}-{random}
 * e.g.     PAY-TRAVA-HWA-00001-1735000000000-A3F2
 */
export function generatePaymentReference(bookingNumber: string): string {
  const ts     = Date.now();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PAY-${bookingNumber}-${ts}-${random}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const PaymentServices = {
  initiatePayment,
  cancelAndDeleteBooking,
  markBookingPaymentFailed,
  confirmPayment,
  getPaymentsByBooking,
  generatePaymentReference,
};

export default PaymentServices;