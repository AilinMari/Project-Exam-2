interface GuestsInputProps {
  value: number;
  onChange: (value: number) => void;
  maxGuests: number;
}

export default function GuestsInput({ value, onChange, maxGuests }: GuestsInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Number of Guests
      </label>
      <input
        type="number"
        required
        min="1"
        max={maxGuests}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
    </div>
  );
}
