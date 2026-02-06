interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export default function DateInput({ label, value, onChange, min }: DateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="date"
        required
        min={min || new Date().toISOString().split('T')[0]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
      />
    </div>
  );
}
