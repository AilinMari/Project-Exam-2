import { API_BASE_URL, API_KEY } from '../config/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(requiresAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': this.apiKey,
    };

    if (requiresAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, ...fetchOptions } = options;

    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.getHeaders(requiresAuth),
        ...(fetchOptions.headers || {}),
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'An error occurred');
    }

    // Handle empty responses (like DELETE requests)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // For responses without content (e.g., 204 No Content)
    return {} as T;
  }

  get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  post<T>(endpoint: string, data?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  put<T>(endpoint: string, data?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL, API_KEY);
