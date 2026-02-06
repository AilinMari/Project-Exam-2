interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({ isMenuOpen, onClick }: MobileMenuButtonProps) {
  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={onClick}
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
  );
}
