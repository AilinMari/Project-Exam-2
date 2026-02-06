import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { handleLogout as logout } from './Navbar/handlers/handleLogout';
import NavLogo from './Navbar/components/NavLogo';
import DesktopMenu from './Navbar/components/DesktopMenu';
import MobileMenuButton from './Navbar/components/MobileMenuButton';
import MobileMenu from './Navbar/components/MobileMenu';

export default function Navbar() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    const venueManagerValue = localStorage.getItem('venueManager');
    const venueManager = venueManagerValue === 'true';
    
    setIsLoggedIn(!!token);
    setUserName(name);
    setIsVenueManager(venueManager);
  }, [location]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogoutClick = () => {
    logout();
    setIsLoggedIn(false);
    setUserName(null);
    setIsVenueManager(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLogo />
            </div>
            
            <DesktopMenu
              isLoggedIn={isLoggedIn}
              userName={userName}
              isVenueManager={isVenueManager}
              onLogout={handleLogoutClick}
            />

            <MobileMenuButton
              isMenuOpen={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <MobileMenu
        isOpen={isMenuOpen}
        isLoggedIn={isLoggedIn}
        userName={userName}
        isVenueManager={isVenueManager}
        onLogout={handleLogoutClick}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
