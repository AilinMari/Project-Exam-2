# Holidaze - Venue Booking Platform

A modern venue booking application built with React, TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **Browse Venues**: View and search through available venues
- **Venue Details**: See detailed information about each venue including amenities, location, and pricing
- **User Authentication**: Register and login with Noroff API authentication
- **Book Venues**: Make bookings for selected dates and number of guests
- **User Profile**: Manage your bookings and view booking history
- **Venue Manager**: Special role for users who want to list their own venues

## 🛠️ Tech Stack

- **Vite** - Fast build tool and development server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Noroff API v2** - Backend API for Holidaze

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Noroff student email (@stud.noroff.no or @noroff.no) for registration

## 🔧 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd Project-Exam-2
```

2. Install dependencies:

```bash
npm install
```

3. **Configure API Key** (Important!):
   - Open `src/config/api.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual Noroff API key
   - You can get an API key from: https://docs.noroff.dev/docs/v2

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Configuration

The application uses the Noroff API v2. Key endpoints:

- **Base URL**: `https://v2.api.noroff.dev`
- **Venues**: `/holidaze/venues`
- **Bookings**: `/holidaze/bookings`
- **Profiles**: `/holidaze/profiles`
- **Auth**: `/auth/register` and `/auth/login`

### Important API Notes:

1. **Registration**: Must use a valid `@stud.noroff.no` or `@noroff.no` email
2. **Authentication**: Access token is stored in localStorage after login
3. **Venue Manager**: Check the "venue manager" option during registration to list venues
4. **Query Parameters**: Use `_owner=true`, `_bookings=true`, etc. to include related data

## 📁 Project Structure

```
Project-Exam-2/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Home.tsx            # Venue listing page
│   │   ├── VenueDetails.tsx    # Individual venue page
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   └── Profile.tsx         # User profile & bookings
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── apiClient.ts        # API client utility
│   ├── config/
│   │   └── api.ts              # API configuration
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔐 Authentication Flow

1. **Register**: Create an account with Noroff email
2. **Login**: Authenticate and receive access token
3. **Token Storage**: Token saved in localStorage
4. **Protected Routes**: Profile and booking features require authentication

## 🎨 Styling

The application uses Tailwind CSS for styling with:

- Responsive design for mobile, tablet, and desktop
- Dark mode support in configuration
- Custom color scheme with blue as primary color
- Hover states and transitions for better UX

## 🚧 Future Enhancements

- [ ] Create and manage venues (for venue managers)
- [ ] Edit user profile (avatar, banner, bio)
- [ ] Venue image gallery lightbox
- [ ] Calendar view for availability
- [ ] Booking confirmation emails
- [ ] Reviews and ratings system
- [ ] Advanced search filters
- [ ] Map integration for venue locations

## 📚 API Documentation

For detailed API documentation, visit:

- [Holidaze Bookings](https://docs.noroff.dev/docs/v2/holidaze/bookings)
- [Holidaze Venues](https://docs.noroff.dev/docs/v2/holidaze/venues)
- [Holidaze Profiles](https://docs.noroff.dev/docs/v2/holidaze/profiles)

## 🐛 Known Issues

- API key must be configured manually in `src/config/api.ts`
- Some TypeScript errors in development are normal (related to CSS imports)
- Venue creation feature not yet implemented (coming soon)

## 📄 License

This project is created as part of a Noroff school assignment.

## 👤 Author

Your Name - Noroff Student

---

**Note**: Remember to add your API key before running the application!
