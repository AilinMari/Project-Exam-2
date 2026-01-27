# Quick Start Guide

## Before You Begin

1. **Get an API Key**:
   - Go to https://docs.noroff.dev/docs/v2
   - Follow the instructions to generate your API key
   - You'll need this for the application to work

2. **Configure the API Key**:
   - Open `src/config/api.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## First Steps in the Application

1. **Register an Account**:
   - Click "Register" in the navigation
   - Use a `@stud.noroff.no` or `@noroff.no` email
   - Check "venue manager" if you want to list venues

2. **Browse Venues**:
   - The home page shows all available venues
   - Use the search bar to find specific venues

3. **Book a Venue**:
   - Click on any venue to see details
   - Click "Book Now" and select your dates
   - You must be logged in to book

4. **Manage Your Bookings**:
   - Go to your Profile page
   - View all your bookings
   - Cancel bookings if needed

## API Endpoints Reference

### Public Endpoints (No Authentication)

- GET `/holidaze/venues` - List all venues
- GET `/holidaze/venues/:id` - Get venue details
- GET `/holidaze/venues/search?q=query` - Search venues

### Authenticated Endpoints

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/holidaze/bookings` - Create booking
- GET `/holidaze/profiles/:name` - Get user profile
- GET `/holidaze/profiles/:name/bookings` - Get user bookings
- DELETE `/holidaze/bookings/:id` - Cancel booking

## Troubleshooting

### "Cannot find module" errors

Run `npm install` to ensure all dependencies are installed.

### API errors

- Check that your API key is correctly configured in `src/config/api.ts`
- Make sure you're using a valid Noroff email for registration

### TypeScript errors

Some CSS-related TypeScript errors are normal and won't affect functionality.

## Project Structure

- `src/pages/` - Page components (Home, Login, Register, etc.)
- `src/components/` - Reusable components (Layout, etc.)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions (API client)
- `src/config/` - Configuration files (API endpoints)

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.
