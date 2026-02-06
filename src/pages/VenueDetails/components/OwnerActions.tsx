interface OwnerActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function OwnerActions({ onEdit, onDelete }: OwnerActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onEdit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit Venue
      </button>
      <button
        onClick={onDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Venue
      </button>
    </div>
  );
}
