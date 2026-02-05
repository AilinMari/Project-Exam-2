import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check auth status whenever location changes
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    const venueManagerValue = localStorage.getItem('venueManager');
    const venueManager = venueManagerValue === 'true';
    
    setIsLoggedIn(!!token);
    setUserName(name);
    setIsVenueManager(venueManager);
  }, [location]);

  useEffect(() => {
    // Close menu when location changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('venueManager');
    setIsLoggedIn(false);
    setUserName(null);
    setIsVenueManager(false);
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="bg-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/Images/holidaze logo.png" 
                  alt="Holidaze Logo" 
                  className="h-8 sm:h-10 w-auto"
                />
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  Holidaze
                </span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  {userName && (
                    <span className={`px-3 py-2 text-sm font-semibold ${
                      isVenueManager ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      Welcome, {userName}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`text-white px-4 py-2 rounded-md text-sm font-medium ${
                      isVenueManager 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile slide-in menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 space-y-4">
          {/* Close button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-700 hover:text-blue-600"
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-8 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {userName && (
                  <div className={`px-3 py-2 text-sm font-semibold ${
                    isVenueManager ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    Welcome, {userName}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`w-full text-left text-white px-3 py-2 rounded-md text-sm font-medium ${
                    isVenueManager 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
