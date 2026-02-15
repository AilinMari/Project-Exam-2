# Holidaze - Venue Booking Application

A fully functional venue booking platform built with React and TypeScript. Users can browse available venues, make bookings, and managers can create and manage their own venues.

## Features

- **Browse & Search Venues** - View all available venues with search functionality
- **Venue Details** - See comprehensive information including images, amenities, location, and pricing
- **User Authentication** - Register and login with Noroff API
- **Make Bookings** - Book venues for specific dates with interactive calendar
- **User Profile** - View booking history, manage bookings, and edit profile information
- **Venue Management** - Venue managers can create, edit, and delete their venues
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Toast Notifications** - User feedback for all actions (success, error, warning, info)
- **Protected Routes** - Authentication guard for protected pages

## Tech Stack

- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Noroff API v2** - Backend

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Noroff student email (@stud.noroff.no)

## Installation

1. Clone and install:

```bash
git clone <repo-url>
cd Project-Exam-2
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open `http://localhost:5173`

## How to Use

### For Customers

1. Register with your Noroff email
2. Browse venues from the home page
3. Click on a venue to see details
4. Select dates and guest count to make a booking
5. View your bookings in your profile

### For Venue Managers

1. Register and check the "venue manager" option
2. Go to your profile to create a new venue
3. Fill in venue details, images, and amenities
4. Manage your venues from the profile page
5. View incoming bookings

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Navigation
│   ├── Layout.tsx              # Main layout
│   ├── Toast.tsx               # Toast notifications
│   ├── ProtectedRoute.tsx       # Auth guard
│   ├── SearchBar.tsx           # Search component
│   ├── venue/                  # Venue-related components
│   ├── booking/                # Booking calendar
│   ├── profile/                # Profile components
│   ├── modals/                 # Forms and modals
│   └── Carousel.tsx            # Image carousel
├── pages/
│   ├── Home.tsx                # Home page
│   ├── VenueDetails.tsx        # Venue detail page
│   ├── Profile.tsx             # User profile
│   ├── Login.tsx               # Login page
│   └── Register.tsx            # Registration page
├── context/
│   └── ToastContext.tsx        # Toast state management
├── types/
│   └── index.ts                # TypeScript types
├── utils/
│   └── apiClient.ts            # API client
├── config/
│   └── api.ts                  # API endpoints
└── App.tsx                     # Main app
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## API Endpoints

All requests go to: `https://v2.api.noroff.dev/holidaze`

- **GET /venues** - Get all venues
- **GET /venues/:id** - Get venue details
- **POST /bookings** - Create booking
- **DELETE /bookings/:id** - Cancel booking
- **POST /venues** - Create venue (managers only)
- **PUT /venues/:id** - Update venue (managers only)
- **DELETE /venues/:id** - Delete venue (managers only)
- **PUT /profiles/:name** - Update profile

## Key Implementation Details

### Authentication

- JWT token stored in localStorage
- Protected routes redirect to login if not authenticated
- Logout clears token and redirects to home

### Bookings

- Interactive calendar shows booked dates
- Date range selection with validation
- Real-time price calculation
- Confirmation dialog before booking

### Profile Management

- Edit bio, avatar, and banner
- View all personal bookings
- For managers: Create, edit, delete venues
- View incoming bookings for your venues

### Notifications

- Success toasts for completed actions
- Error toasts with helpful messages
- Auto-dismiss after 3 seconds
- Manual close button available

## Styling

Uses Tailwind CSS with:

- Blue (#2563EB) as primary color
- Orange (#EA580C) as secondary color
- Gray scale for UI elements
- Responsive breakpoints
- Custom animations for toasts

## Future Improvements

- Email confirmation for bookings
- Review and rating system
- Advanced search filters by price, location, amenities
- Visual booking calendar for managers (currently shows list)
- Image optimization and lazy loading
- Unit tests
- Guest reviews and ratings on past bookings

## Notes

- Make sure to use a valid @stud.noroff.no email to register
- Venue managers must select the venue manager option during registration
- All images for venues must be valid URLs
- The application uses localStorage for authentication - clearing browser data will log you out

## Assignment Details

This project was created as a Noroff Exam Project 2. It demonstrates full CRUD operations, authentication, state management, and responsive UI design using modern React practices.
