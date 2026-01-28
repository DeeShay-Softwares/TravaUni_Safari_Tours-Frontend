// src/types/index.ts
export interface Trip {
  id: string;
  title: string;
  duration: number;
  price: number;
  startDate: string;
  endDate: string;
  rating: number;
  image: string;
  description: string;
  location: string;
  reviewCount: number;
}

export interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  className: string
}

export interface TripDetailsModalProps {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
}

export interface AdminTripFormProps {
  trip: Trip | null;
  onSubmit: (tripData: Trip) => void;
  onCancel: () => void;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// src/types/booking.ts
export interface BookingUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  important: boolean;
}

export interface BookedTrip {
  id: string;
  bookingId: string; // Unique booking reference
  userId: string; // Phone number
  tripId: string;
  tripTitle: string;
  tripImage: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  updates: BookingUpdate[];
  whatsappGroupLink?: string;
}

export interface VerificationData {
  bookingId: string;
  phoneNumber: string;
}