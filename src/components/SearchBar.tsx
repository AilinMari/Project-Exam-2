import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  location: string;
  guests: number | '';
  dateFrom: string;
  dateTo: string;
  onSearchQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onGuestsChange: (value: number | '') => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
}

export default function SearchBar({
  searchQuery,
  location,
  guests,
  dateFrom,
  dateTo,
  onSearchQueryChange,
  onLocationChange,
  onGuestsChange,
  onDateFromChange,
  onDateToChange,
  onSubmit,
  onClearFilters,
}: SearchBarProps) {
  const hasFilters = searchQuery || location || guests || dateFrom || dateTo;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-4xl bg-white rounded-lg shadow-lg mb-8">
      {/* Desktop layout - horizontal */}
      <div className="hidden lg:flex">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search for a venue.."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-s-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Location"
          className="w-40 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="number"
          value={guests}
          onChange={(e) => onGuestsChange(e.target.value ? parseInt(e.target.value) : '')}
          placeholder="Guests"
          min="1"
          className="w-32 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          placeholder="Check in"
          min={new Date().toISOString().split('T')[0]}
          className="w-40 px-4 py-3 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          placeholder="Check out"
          min={dateFrom || new Date().toISOString().split('T')[0]}
          className="w-40 px-4 py-3 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-e-md hover:bg-blue-700 font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Mobile layout - vertical */}
      <div className="lg:hidden p-4 flex flex-col gap-2">
        {/* Search input with button */}
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search for a venue.."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-3 rounded-r-md hover:bg-blue-700 font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Location"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <input
            type="number"
            value={guests}
            onChange={(e) => onGuestsChange(e.target.value ? parseInt(e.target.value) : '')}
            placeholder="Guests"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            placeholder="Check in"
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            placeholder="Check out"
            min={dateFrom || new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Clear filters button */}
      {hasFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-3 mb-3 text-sm text-gray-600 hover:text-gray-800 underline w-full text-center"
        >
          Clear all filters
        </button>
      )}
    </form>
  );
}
