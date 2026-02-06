import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userName: string | null;
  isVenueManager: boolean;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, isLoggedIn, userName, isVenueManager, onLogout, onClose }: MobileMenuProps) {
  return (
    <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="p-6 space-y-4">
        <button
          onClick={onClose}
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
                onClick={onLogout}
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
  );
}
