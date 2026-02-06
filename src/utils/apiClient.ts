import { API_BASE_URL, API_KEY } from '../config/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * API Client for handling HTTP requests to the Noroff API
 * Manages authentication, headers, and error handling
 */
class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Constructs headers for API requests
   * @param requiresAuth - Whether the request requires authentication token
   * @returns Headers object with API key and optional Bearer token
   */
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

  /**
   * Generic request handler for all HTTP methods
   * @param endpoint - API endpoint path
   * @param options - Request options including method, body, and auth requirements
   * @returns Promise resolving to the parsed JSON response
   * @throws Error if the request fails or returns non-OK status
   */
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

  /**
   * Performs a GET request
   * @param endpoint - API endpoint path
   * @param requiresAuth - Whether authentication is required
   * @returns Promise with the response data
   */
  get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  /**
   * Performs a POST request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param requiresAuth - Whether authentication is required
   * @returns Promise with the response data
   */
  post<T>(endpoint: string, data?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  /**
   * Performs a PUT request
   * @param endpoint - API endpoint path
   * @param data - Request body data
   * @param requiresAuth - Whether authentication is required
   * @returns Promise with the response data
   */
  put<T>(endpoint: string, data?: unknown, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  /**
   * Performs a DELETE request
   * @param endpoint - API endpoint path
   * @param requiresAuth - Whether authentication is required
   * @returns Promise with the response data (empty object for 204 responses)
   */
  delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

/** Singleton instance of the API client */
export const apiClient = new ApiClient(API_BASE_URL, API_KEY);
