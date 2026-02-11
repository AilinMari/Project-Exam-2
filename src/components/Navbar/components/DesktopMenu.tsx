import { Link } from 'react-router-dom';

interface DesktopMenuProps {
  isLoggedIn: boolean;
  userName: string | null;
  isVenueManager: boolean;
  onLogout: () => void;
}

export default function DesktopMenu({ isLoggedIn, userName, isVenueManager, onLogout }: DesktopMenuProps) {
  return (
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
              isVenueManager ? 'text-orange-600' : 'text-blue-600'
            }`}>
              Welcome, {userName}
            </span>
          )}
          <button
            onClick={onLogout}
            className={`text-white px-4 py-2 rounded-md text-sm font-medium ${
              isVenueManager
                ? 'bg-orange-600 hover:bg-orange-700' 
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
  );
}
