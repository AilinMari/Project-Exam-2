import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('venueManager');
    setIsLoggedIn(false);
    setUserName(null);
    setIsVenueManager(false);
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/Images/holidaze logo.png" 
                alt="Holidaze Logo" 
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-blue-600">
                Holidaze
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  );
}
