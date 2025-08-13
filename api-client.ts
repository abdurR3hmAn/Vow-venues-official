import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { z } from 'zod';
import { 
  type User, 
  type Venue, 
  type InsertUser, 
  type LoginUser, 
  type InsertVenue,
  insertUserSchema,
  loginUserSchema,
  insertVenueSchema
} from './schema';

// Base configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:3000';

// API Response types
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

interface AuthResponse {
  user: User;
  message: string;
}

// Create axios instance
const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session cookies
  });

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

// API Client class
export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = createApiClient(baseURL);
  }

  // Auth endpoints
  async login(credentials: LoginUser): Promise<AuthResponse> {
    const validatedData = loginUserSchema.parse(credentials);
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/login', validatedData);
    return response.data;
  }

  async register(userData: InsertUser): Promise<AuthResponse> {
    const validatedData = insertUserSchema.parse(userData);
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/register', validatedData);
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.post('/api/auth/logout');
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response: AxiosResponse<{ user: User }> = await this.client.get('/api/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  // Venue endpoints
  async getVenues(): Promise<Venue[]> {
    const response: AxiosResponse<Venue[]> = await this.client.get('/api/venues');
    return response.data;
  }

  async getVenueById(id: string): Promise<Venue> {
    const response: AxiosResponse<Venue> = await this.client.get(`/api/venues/${id}`);
    return response.data;
  }

  async createVenue(venueData: InsertVenue): Promise<Venue> {
    const validatedData = insertVenueSchema.parse(venueData);
    const response: AxiosResponse<Venue> = await this.client.post('/api/venues', validatedData);
    return response.data;
  }

  async updateVenue(id: string, venueData: Partial<InsertVenue>): Promise<Venue> {
    const response: AxiosResponse<Venue> = await this.client.put(`/api/venues/${id}`, venueData);
    return response.data;
  }

  async deleteVenue(id: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.client.delete(`/api/venues/${id}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: {
    venueId: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    guests: number;
    notes?: string;
  }): Promise<{ message: string; bookingId?: string }> {
    const response = await this.client.post('/api/bookings', bookingData);
    return response.data;
  }

  async getBookings(): Promise<any[]> {
    const response = await this.client.get('/api/bookings');
    return response.data;
  }

  // Feedback endpoints
  async submitFeedback(feedbackData: {
    name: string;
    email: string;
    message: string;
    rating?: number;
  }): Promise<{ message: string }> {
    const response = await this.client.post('/api/feedback', feedbackData);
    return response.data;
  }

  // Utility methods
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Create default instance
export const apiClient = new ApiClient();

// Export for use in React Query
export default apiClient;
