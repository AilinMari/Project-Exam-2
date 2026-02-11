import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import { LoginCredentials, AuthResponse, Profile, ApiResponse } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.login,
        formData
      );

      console.log('Login successful:', response);

      // Store access token and username first
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userName', response.data.name);

      // Fetch user profile to get venueManager status
      try {
        const profileResponse = await apiClient.get<ApiResponse<Profile>>(
          `${API_ENDPOINTS.profileByName(response.data.name)}`,
          true
        );
        console.log('Profile data:', profileResponse);
        const isVenueManager = profileResponse.data?.venueManager || false;
        localStorage.setItem('venueManager', isVenueManager ? 'true' : 'false');
        console.log('Stored venueManager:', isVenueManager);
      } catch (profileErr) {
        console.error('Could not fetch profile:', profileErr);
        // Default to false if profile fetch fails
        localStorage.setItem('venueManager', 'false');
      }
      
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = (err as { response?: { data?: { errors?: Array<{ message: string }> } }; message?: string })?.response?.data?.errors?.[0]?.message 
        || (err as Error).message 
        || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Log In
          </h2>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-orange-50 p-4">
              <p className="text-sm text-orange-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
