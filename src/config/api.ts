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
  updateProfile: (name: string) => `/holidaze/profiles/${name}`,
  profileBookings: (name: string) => `/holidaze/profiles/${name}/bookings`,
  profileVenues: (name: string) => `/holidaze/profiles/${name}/venues`,
  searchProfiles: '/holidaze/profiles/search',
} as const;

// API Key - You need to create an API key
// 1. Register/Login at https://v2.api.noroff.dev
// 2. Go to https://v2.api.noroff.dev/auth/create-api-key
// 3. Replace the value below with your API key
export const API_KEY = '3b4ae846-f7ea-4cc9-9520-37a13084592a';


