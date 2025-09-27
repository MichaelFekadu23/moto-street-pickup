// services/apiService.ts

import type { Receipt } from "../utils/type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data.error?.message || `Request failed with status ${response.status}`,
            code: data.error?.code,
          },
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  // POST request
  async post<T>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Create and export the API service instance
export const apiService = new ApiService(API_BASE_URL);

// Types for API responses
export interface FareResponse {
  total_fare: number;
  distance_km: number;
  duration_minutes: number;
  breakdown?: {
    currency?: string;
    total_fare?: number;
  };
}

export interface PaymentResponse {
  message: string;
  method: string;
  paid: boolean;
  processed_at: string;
  ride_id: string;
  error?: { message: string };
}

// Specific ride-related API calls
export const rideApi = {
  async confirmRideEnd(rideId: string): Promise<ApiResponse> {
    return apiService.post(`/rider/${rideId}/confirm`, {
      confirmed: true,
      ride_id: rideId,
    });
  },

  async getRideStatus(rideId: string, phoneNumber?: string): Promise<ApiResponse<{ status: string }>> {
    const params = new URLSearchParams();
    if (phoneNumber) params.append('phone', phoneNumber);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    return apiService.get(`/ride/${rideId}/status${query}`);
  },

  async getRideFare(rideId: string): Promise<ApiResponse<FareResponse>> {
    return apiService.get(`/street-ride/fare/${rideId}`);
  },

  async processPayment(rideId: string, method: string): Promise<ApiResponse<PaymentResponse>> {
    return apiService.post(`/street-ride/payment`, {
      ride_id: rideId,
      method,
    });
  },

  async getReceipt(rideId: string): Promise<ApiResponse<Receipt>> {
    return apiService.get(`/street-ride/receipt/${rideId}`);
  },
};


// Generic error handler hook
export function useApiError() {
  const handleApiError = (error: ApiError | null): string | null => {
    if (!error) return null;
    
    // You can customize error messages here based on error codes
    switch (error.code) {
      case 'RIDE_NOT_FOUND':
        return 'Ride not found. Please check your ride ID.';
      case 'RIDE_ALREADY_COMPLETED':
        return 'This ride has already been completed.';
      case 'UNAUTHORIZED':
        return 'You are not authorized to perform this action.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  };

  return { handleApiError };
}