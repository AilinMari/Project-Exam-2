import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { RegisterData, AuthResponse, Profile, ApiResponse } from '../types';

export default function Register() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customer' | 'manager'>('customer');
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: { url: '', alt: '' },
    venueManager: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: 'customer' | 'manager') => {
    setActiveTab(tab);
    setFormData({ ...formData, venueManager: tab === 'manager' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Prepare data - remove empty fields
      const submitData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        venueManager: formData.venueManager,
      };

      // Only add avatar if URL is provided
      if (formData.avatar?.url) {
        submitData.avatar = {
          url: formData.avatar.url,
          alt: formData.name || 'User avatar',
        };
      }

      // Only add bio if provided
      if (formData.bio) {
        submitData.bio = formData.bio;
      }

      console.log('Submitting registration data:', submitData);

      // Register user
      const registerResponse = await apiClient.post(API_ENDPOINTS.register, submitData);
      console.log('Registration successful:', registerResponse);

      // Auto-login after registration
      const loginResponse = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.login,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem('accessToken', loginResponse.data.accessToken);
      localStorage.setItem('userName', loginResponse.data.name);

      // Fetch user profile to get venueManager status
      try {
        const profileResponse = await apiClient.get<ApiResponse<Profile>>(
          `${API_ENDPOINTS.profileByName(loginResponse.data.name)}`,
          true
        );
        const isVenueManager = profileResponse.data?.venueManager || false;
        localStorage.setItem('venueManager', isVenueManager ? 'true' : 'false');
      } catch (profileErr) {
        console.error('Could not fetch profile:', profileErr);
        // Use the registration form value as fallback
        localStorage.setItem('venueManager', formData.venueManager ? 'true' : 'false');
      }

      navigate('/profile');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = (err as { response?: { data?: { errors?: Array<{ message: string }> } }; message?: string })?.response?.data?.errors?.[0]?.message 
        || (err as Error).message 
        || 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Tab Buttons */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'customer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Register as a Customer
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('manager')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'manager'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Register as a Venue Manager
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          {activeTab === 'customer'
            ? 'Book venues and view upcoming trips.'
            : 'Create and manage your own venues.'}
        </p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email"
              />
              <p className="mt-1 text-xs text-gray-500">Must be a @stud.noroff.no email</p>
            </div>
            
            <div>
              <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Avatar URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="avatar"
                name="avatar"
                type="url"
                value={formData.avatar?.url || ''}
                onChange={(e) => setFormData({ ...formData, avatar: { url: e.target.value, alt: formData.name } })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="URL link"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                activeTab === 'customer'
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
              }`}
            >
              {loading ? 'Creating account...' : `Register as a ${activeTab === 'customer' ? 'Customer' : 'Venue Manager'}`}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
