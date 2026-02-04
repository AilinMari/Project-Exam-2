import { Profile } from '../../types';

interface ProfileHeaderProps {
  profile: Profile;
  onEditClick: () => void;
}

export default function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  return (
    <div className={`py-12 ${profile.venueManager ? 'bg-red-500' : 'bg-blue-600'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 inline-block">
          <div className="flex items-center gap-4">
            {profile.avatar?.url ? (
              <img
                src={profile.avatar.url}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {profile.name[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className={`text-2xl font-bold ${
                profile.venueManager ? 'text-red-600' : 'text-blue-600'
              }`}>
                Hello,<br />{profile.name}!
              </h1>
              <button 
                onClick={onEditClick}
                className={`mt-2 text-white px-4 py-1 rounded text-sm ${
                  profile.venueManager 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
