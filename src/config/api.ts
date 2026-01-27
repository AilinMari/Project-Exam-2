// API Base URL
export const API_BASE_URL = 'https://v2.api.noroff.dev';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  register: '/auth/register',
  login: '/auth/login',
  
  // Venues
  venues: '/holidaze/venues',
  venueById: (id: string) => `/holidaze/venues/${id}`,
  searchVenues: '/holidaze/venues/search',
  
  // Bookings
  bookings: '/holidaze/bookings',
  bookingById: (id: string) => `/holidaze/bookings/${id}`,
  
  // Profiles
  profiles: '/holidaze/profiles',
  profileByName: (name: string) => `/holidaze/profiles/${name}`,
  profileBookings: (name: string) => `/holidaze/profiles/${name}/bookings`,
  profileVenues: (name: string) => `/holidaze/profiles/${name}/venues`,
  searchProfiles: '/holidaze/profiles/search',
} as const;

// API Key (you'll need to get this from Noroff)
export const API_KEY = 'YOUR_API_KEY_HERE';
