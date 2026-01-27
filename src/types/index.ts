// Media/Image type
export interface Media {
  url: string;
  alt: string;
}

// Location type
export interface Location {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
}

// Meta amenities type
export interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

// Profile/User type
export interface Profile {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
}

// Venue type
export interface Venue {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: Location;
  owner?: Profile;
  bookings?: Booking[];
}

// Booking type
export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  customer?: Profile;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  meta: {
    isFirstPage?: boolean;
    isLastPage?: boolean;
    currentPage?: number;
    previousPage?: number | null;
    nextPage?: number | null;
    pageCount?: number;
    totalCount?: number;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}

export interface AuthResponse {
  data: {
    name: string;
    email: string;
    bio?: string;
    avatar?: Media;
    banner?: Media;
    venueManager?: boolean;
    accessToken: string;
  };
}

// Create venue request
export interface CreateVenueData {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Partial<VenueMeta>;
  location?: Partial<Location>;
}

// Create booking request
export interface CreateBookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

// Update booking request
export interface UpdateBookingData {
  dateFrom?: string;
  dateTo?: string;
  guests?: number;
}

// Update profile request
export interface UpdateProfileData {
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
}
