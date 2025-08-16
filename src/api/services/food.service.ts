import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../config';
import type { 
  Food, 
  CreateFoodRequest, 
  UpdateFoodRequest, 
  FoodQueryParams
} from '../types';

class FoodService {
  private readonly endpoint = '/foods';

  /**
   * Get all foods with optional filters
   */
  async getAllFoods(params?: FoodQueryParams): Promise<ApiResponse<Food[]>> {
    try {
      const response = await apiClient.get(this.endpoint, { params });
      return handleApiResponse<Food[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get food by ID
   */
  async getFoodById(id: string): Promise<ApiResponse<Food>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}`);
      return handleApiResponse<Food>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Search foods by text
   */
  async searchFoods(query: string): Promise<ApiResponse<Food[]>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/search`, {
        params: { q: query }
      });
      return handleApiResponse<Food[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get all food categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/categories`);
      return handleApiResponse<string[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Create new food item (admin only)
   */
  async createFood(foodData: CreateFoodRequest): Promise<ApiResponse<Food>> {
    try {
      const response = await apiClient.post(this.endpoint, foodData);
      return handleApiResponse<Food>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Update food item (admin only)
   */
  async updateFood(id: string, foodData: UpdateFoodRequest): Promise<ApiResponse<Food>> {
    try {
      const response = await apiClient.put(`${this.endpoint}/${id}`, foodData);
      return handleApiResponse<Food>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete food item (admin only)
   */
  async deleteFood(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`${this.endpoint}/${id}`);
      return handleApiResponse<void>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get foods by category
   */
  async getFoodsByCategory(category: string): Promise<ApiResponse<Food[]>> {
    try {
      const response = await apiClient.get(this.endpoint, {
        params: { category }
      });
      return handleApiResponse<Food[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get featured/popular foods
   */
  async getFeaturedFoods(limit: number = 10): Promise<ApiResponse<Food[]>> {
    try {
      const response = await apiClient.get(this.endpoint, {
        params: { 
          sortBy: 'rating',
          sortOrder: 'desc',
          limit 
        }
      });
      return handleApiResponse<Food[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const foodService = new FoodService();