// In your types file (../types)
// export interface Trip {
//   id: string;
//   title: string;
//   duration: number;
//   price: number;
//   startDate: string;
//   endDate: string;
//   image: string;
//   description: string;
//   location: string;
//   packages: string[]; // New field for packages/activities
// }

export interface TripCardProps {
  trip: TripInput;
  onClick?: () => void;
  className: string;
}

export interface TripDetailsModalProps {
  trip: TripInput | null;
  open: boolean;
  onClose: () => void;
}

// export interface AdminTripFormProps {
//   trip: Trip | null;
//   onSubmit: (tripData: Trip) => void;
//   onCancel: () => void;
// }

export interface TripInput {
  title: string;
  location: string;
  price: number;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
}

export interface AdminTripFormProps {
  trip?: TripInput & { id?: string };
  onCancel: () => void;
  onSuccess?: () => void;
  loading?: boolean;
  formMode: "create" | "edit";
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
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
  status: "confirmed" | "pending" | "cancelled" | "completed";
  bookingDate: string;
  updates: BookingUpdate[];
  whatsappGroupLink?: string;
}

export interface VerificationData {
  bookingId: string;
  phoneNumber: string;
}

// src/types/admin.ts
export interface TripUpdate {
  id: string;
  tripId: string;
  title: string;
  content: string;
  date: string;
  attachments?: string[]; // Array of image URLs
  important: boolean;
  sentTo: "whatsapp" | "email" | "both";
}

export interface Registration {
  id: string;
  bookingId: string;
  tripId: string;
  tripTitle: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "partial" | "paid";
  paymentProof?: string; // URL to payment proof image
  paymentAmount: number;
  registrationDate: string;

  // Personal Details
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: "male" | "female" | "other";
  nationality: string;

  // Student Information
  isStudent: boolean;
  university?: string;
  studentId?: string;
  studentProof?: string; // URL to student proof

  // Emergency Contact
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Medical Information
  medicalConditions?: string;
  dietaryRestrictions?: string;

  // Communication
  whatsappNumber?: string;
  preferredContact: "whatsapp" | "email" | "phone";

  // Confirmation Tracking
  confirmedBy?: string;
  confirmedAt?: string;
  confirmationEmailSent: boolean;
  whatsappGroupAdded: boolean;
}

//auth types
export interface User {
  id: string;
  username: string;
  role: string;
  name?: string;
  status: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export class ApiError extends Error {
  public statusCode: number;
  public data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}
