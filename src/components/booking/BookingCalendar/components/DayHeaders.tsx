export default function DayHeaders() {
  return (
    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-1 sm:py-2">
          {day}
        </div>
      ))}
    </div>
  );
}
