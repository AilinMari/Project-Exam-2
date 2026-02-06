import { Link } from 'react-router-dom';

export default function NavLogo() {
  return (
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
  );
}
