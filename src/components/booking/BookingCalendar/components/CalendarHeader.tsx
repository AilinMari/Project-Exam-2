interface CalendarHeaderProps {
  monthName: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({ monthName, onPreviousMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4">
      <button
        onClick={onPreviousMonth}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{monthName}</h3>
      <button
        onClick={onNextMonth}
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
        aria-label="Next month"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
