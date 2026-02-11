import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export default function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <div className="relative h-[400px] sm:h-[400px] lg:h-[400px] bg-cover bg-center" 
         style={{ 
           backgroundImage: 'url(/Images/hero.png)'
         }}>
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Register Buttons - Only show when not logged in */}
      {!isLoggedIn && (
        <div className="relative top-20 z-10 flex flex-col items-center justify-center px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-2xl justify-center">
            <Link
              to="/register"
              state={{ tab: 'customer' }}
              className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-md hover:bg-blue-700 font-medium text-center shadow-lg w-full"
            >
              Register as a Customer
            </Link>
            <Link
              to="/register"
              state={{ tab: 'manager' }}
              className="bg-orange-600 text-white px-6 sm:px-8 py-3 rounded-md hover:bg-orange-700 font-medium text-center shadow-lg w-full"
            >
              Register as a Venue Manager
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
