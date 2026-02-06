export default function CalendarLegend() {
  return (
    <div className="mt-4 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-100 border border-gray-200 rounded"></div>
        <span className="text-gray-600">Booked dates</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded"></div>
        <span className="text-gray-600">Today</span>
      </div>
    </div>
  );
}
