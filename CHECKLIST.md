# Holidaze - Getting Started Checklist

Use this checklist to get your project up and running!

## ✅ Setup Phase (Do Once)

### 1. Initial Setup

- [x] Project files created
- [x] Dependencies installed (`npm install`)
- [x] Development server started (`npm run dev`)
- [x] VS Code workspace configured

### 2. API Configuration ⚠️ REQUIRED

- [ ] Visit: https://docs.noroff.dev/docs/v2
- [ ] Get your Noroff API key
- [ ] Open: `src/config/api.ts`
- [ ] Replace `YOUR_API_KEY_HERE` with your actual key
- [ ] Save the file

### 3. Test the Application

- [ ] Open: http://localhost:5173
- [ ] Check if venue listing loads (after adding API key)
- [ ] Try the search functionality
- [ ] Click on a venue to see details

### 4. Create Test Account

- [ ] Click "Register" in navigation
- [ ] Use email: `yourname@stud.noroff.no`
- [ ] Password: At least 8 characters
- [ ] Check "venue manager" option
- [ ] Complete registration

### 5. Test Core Features

- [ ] Log in with test account
- [ ] Browse venues
- [ ] View venue details
- [ ] Make a test booking
- [ ] Check profile page
- [ ] View your bookings
- [ ] Try canceling a booking

---

## 🎨 Customization Phase

### Design & Branding

- [ ] Review your wireframes
- [ ] Update colors in `tailwind.config.js`
- [ ] Customize `src/components/Layout.tsx` (header/footer)
- [ ] Add your branding/logo
- [ ] Update page titles in each page component

### Home Page (`src/pages/Home.tsx`)

- [ ] Adjust venue card layout
- [ ] Customize search bar design
- [ ] Add filters (optional)
- [ ] Match your wireframe design
- [ ] Add loading skeleton (optional)

### Venue Details (`src/pages/VenueDetails.tsx`)

- [ ] Customize image gallery layout
- [ ] Style the booking form
- [ ] Add calendar integration (optional)
- [ ] Improve amenities display
- [ ] Add reviews section (optional)

### Authentication Pages

- [ ] Style login page (`src/pages/Login.tsx`)
- [ ] Style register page (`src/pages/Register.tsx`)
- [ ] Add validation messages
- [ ] Match brand colors

### Profile Page (`src/pages/Profile.tsx`)

- [ ] Customize profile header
- [ ] Style booking cards
- [ ] Add edit profile button (optional)
- [ ] Improve venue display (for managers)

---

## 🚀 Feature Enhancement Phase

### Essential Features (Recommended)

- [ ] Better error handling
- [ ] Loading states/spinners
- [ ] Form validation messages
- [ ] Responsive design improvements
- [ ] Image fallbacks for missing images

### Nice-to-Have Features

- [ ] Image carousel for venues
- [ ] Calendar date picker
- [ ] Map integration for locations
- [ ] Favorite/bookmark venues
- [ ] Share venue functionality

### Venue Manager Features

- [ ] Create venue page (use `EXAMPLES/CreateVenue.example.tsx`)
- [ ] Edit venue functionality
- [ ] Delete venue with confirmation
- [ ] View bookings for owned venues
- [ ] Venue analytics/stats

### Profile Features

- [ ] Edit profile (avatar, banner, bio)
- [ ] Change password
- [ ] Delete account
- [ ] Booking history with filters
- [ ] Export booking data

---

## 🧪 Testing Phase

### Functionality Testing

- [ ] Test all navigation links
- [ ] Test search with different queries
- [ ] Test booking with various dates
- [ ] Test login/logout flow
- [ ] Test registration validation
- [ ] Test on different screen sizes

### User Experience Testing

- [ ] All buttons have hover states
- [ ] Loading states are visible
- [ ] Error messages are clear
- [ ] Forms validate properly
- [ ] Images load correctly
- [ ] Navigation is intuitive

### Browser Testing

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

### Responsive Testing

- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

---

## 📱 Deployment Phase

### Pre-Deployment

- [ ] Update README.md with your info
- [ ] Remove console.logs
- [ ] Check for TypeScript errors: `npm run lint`
- [ ] Build the project: `npm run build`
- [ ] Test production build: `npm run preview`

### Deployment

- [ ] Choose hosting (Netlify, Vercel, etc.)
- [ ] Connect GitHub repository
- [ ] Configure build settings
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Deploy!
- [ ] Test live site

### Post-Deployment

- [ ] Update repository README with live URL
- [ ] Test all features on live site
- [ ] Check mobile responsiveness
- [ ] Share with friends/testers

---

## 📚 Documentation Phase

### Code Documentation

- [ ] Add comments to complex functions
- [ ] Document custom components
- [ ] Add JSDoc comments for types
- [ ] Update README with new features

### User Documentation

- [ ] Create usage guide (optional)
- [ ] Document known issues
- [ ] Add screenshots to README
- [ ] Write setup instructions for others

---

## 🎯 Final Review

### Code Quality

- [ ] Code is formatted consistently
- [ ] No unused imports
- [ ] No console errors in production
- [ ] Proper error handling everywhere
- [ ] TypeScript types are correct

### Performance

- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] Lazy loading implemented (optional)
- [ ] API calls are efficient

### Accessibility

- [ ] Alt text for all images
- [ ] Proper semantic HTML
- [ ] Keyboard navigation works
- [ ] Color contrast is good

### Security

- [ ] API key is not exposed in frontend (if needed, use env vars)
- [ ] User input is validated
- [ ] Authentication works correctly
- [ ] No sensitive data in localStorage

---

## 📊 Progress Tracker

Track your overall progress:

```
Setup:           ⬜⬜⬜⬜⬜ 0/5
API Config:      ⬜⬜⬜⬜⬜ 0/5
Testing:         ⬜⬜⬜⬜⬜ 0/5
Customization:   ⬜⬜⬜⬜⬜ 0/5
Features:        ⬜⬜⬜⬜⬜ 0/5
Deployment:      ⬜⬜⬜⬜⬜ 0/5

Total Progress:  0/30 (0%)
```

---

## 💡 Tips

1. **Start Simple**: Get the basic functionality working before adding fancy features
2. **Test Often**: Test after each major change
3. **Git Commits**: Commit frequently with clear messages
4. **Ask for Help**: Use the documentation and API docs
5. **Stay Organized**: Check off items as you complete them

---

## 🆘 Quick Help

### Problems?

- **Can't see venues**: Add API key in `src/config/api.ts`
- **Login fails**: Check email format (must be @stud.noroff.no)
- **TypeScript errors**: Run `npm install` again
- **Dev server not working**: Run `npm run dev`

### Resources

- 📖 [Noroff API Docs](https://docs.noroff.dev/docs/v2)
- 📖 [React Documentation](https://react.dev/)
- 📖 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 📖 Project docs in this repo

---

**Remember**: You don't have to complete everything! Focus on the core features first, then add enhancements as time allows.

**Good luck with your project! 🚀**
