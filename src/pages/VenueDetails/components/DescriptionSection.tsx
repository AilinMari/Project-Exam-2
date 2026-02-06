interface DescriptionSectionProps {
  description: string;
}

export default function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">Description</h2>
      <p className="text-gray-700 whitespace-pre-line text-sm">
        {description}
      </p>
    </div>
  );
}
