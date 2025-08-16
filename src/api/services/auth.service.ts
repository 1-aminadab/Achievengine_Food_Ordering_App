import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../config';
import type { 
  User, 
  RegisterUserRequest, 
  LoginUserRequest, 
  AuthResponse
} from '../types';

class AuthService {
  private readonly endpoint = '/users';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  /**
   * Register new user
   */
  async register(userData: RegisterUserRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/register`, userData);
      const authData = handleApiResponse<AuthResponse>(response);
      
      // Store token and user data
      if (authData.data.token) {
        await this.storeAuthData(authData.data.token, authData.data.user);
      }
      
      return authData;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginUserRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/login`, credentials);
      const authData = handleApiResponse<AuthResponse>(response);
      
      // Store token and user data
      if (authData.data.token) {
        await this.storeAuthData(authData.data.token, authData.data.user);
      }
      
      return authData;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
      // User logged out successfully
    } catch (error) {
      // Logout error
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/profile`);
      return handleApiResponse<User>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put(`${this.endpoint}/profile`, userData);
      const updatedUser = handleApiResponse<User>(response);
      
      // Update stored user data
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser.data));
      
      return updatedUser;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(this.TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored auth token
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store authentication data
   */
  private async storeAuthData(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.TOKEN_KEY, token],
        [this.USER_KEY, JSON.stringify(user)]
      ]);
      // Auth data stored successfully
    } catch (error) {
      // Store auth data error
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/refresh-token`);
      const tokenData = handleApiResponse<{ token: string }>(response);
      
      // Update stored token
      if (tokenData.data.token) {
        await AsyncStorage.setItem(this.TOKEN_KEY, tokenData.data.token);
      }
      
      return tokenData;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Verify phone number with OTP
   */
  async verifyPhone(phone: string, otp: string): Promise<ApiResponse<{ verified: boolean }>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/verify-phone`, {
        phone,
        otp
      });
      return handleApiResponse<{ verified: boolean }>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/send-otp`, {
        phone
      });
      return handleApiResponse<{ sent: boolean }>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const authService = new AuthService();