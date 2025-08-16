import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../config';
import type { PromoCode, ValidatePromoCodeRequest, ValidatePromoCodeResponse } from '../types';

class PromoService {
  private readonly endpoint = '/promo-codes';

  /**
   * Validate promo code
   */
  async validatePromoCode(data: ValidatePromoCodeRequest): Promise<ApiResponse<ValidatePromoCodeResponse>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/validate`, data);
      return handleApiResponse<ValidatePromoCodeResponse>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get active promo codes
   */
  async getActivePromoCodes(): Promise<ApiResponse<PromoCode[]>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/active`);
      return handleApiResponse<PromoCode[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get promo code by code
   */
  async getPromoCodeByCode(code: string): Promise<ApiResponse<PromoCode>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${code}`);
      return handleApiResponse<PromoCode>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Apply promo code to order
   */
  async applyPromoCode(code: string, orderValue: number): Promise<ApiResponse<{ discount: number; finalAmount: number }>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/apply`, {
        code,
        orderValue
      });
      return handleApiResponse<{ discount: number; finalAmount: number }>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user's available promo codes (if user authentication is implemented)
   */
  async getUserPromoCodes(userId: string): Promise<ApiResponse<PromoCode[]>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/user/${userId}`);
      return handleApiResponse<PromoCode[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const promoService = new PromoService();