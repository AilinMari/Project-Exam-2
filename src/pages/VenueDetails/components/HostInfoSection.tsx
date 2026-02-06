import { Venue } from '../../../types';

interface HostInfoSectionProps {
  owner: Venue['owner'];
}

export default function HostInfoSection({ owner }: HostInfoSectionProps) {
  if (!owner) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-sm font-medium text-gray-500 mb-2">Hosted by</h2>
      <div className="flex items-center gap-3">
        {owner.avatar?.url ? (
          <img
            src={owner.avatar.url}
            alt={owner.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {owner.name[0].toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900">{owner.name}</p>
          {owner.bio && (
            <p className="text-sm text-gray-600">{owner.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
