import { apiClient, handleApiResponse, handleApiError, ApiResponse } from '../config';
import type { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderStatusRequest, 
  RateOrderRequest,
  OrderQueryParams
} from '../types';

class OrderService {
  private readonly endpoint = '/orders';

  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.post(this.endpoint, orderData);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get orders (user's orders or all orders for admin)
   */
  async getOrders(params?: OrderQueryParams): Promise<ApiResponse<Order[]>> {
    try {
      const response = await apiClient.get(this.endpoint, { params });
      return handleApiResponse<Order[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}`);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, statusData: UpdateOrderStatusRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}/status`, statusData);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.patch(`${this.endpoint}/${id}/cancel`);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Rate order
   */
  async rateOrder(id: string, rating: RateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.post(`${this.endpoint}/${id}/rating`, rating);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get user's order history
   */
  async getUserOrderHistory(userId: string): Promise<ApiResponse<Order[]>> {
    try {
      const response = await apiClient.get(this.endpoint, {
        params: { userId }
      });
      return handleApiResponse<Order[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Get active orders (pending, confirmed, preparing, ready, out_for_delivery)
   */
  async getActiveOrders(): Promise<ApiResponse<Order[]>> {
    try {
      const response = await apiClient.get(this.endpoint, {
        params: { 
          status: 'pending,confirmed,preparing,ready,out_for_delivery' 
        }
      });
      return handleApiResponse<Order[]>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }

  /**
   * Track order status
   */
  async trackOrder(id: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.get(`${this.endpoint}/${id}/track`);
      return handleApiResponse<Order>(response);
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

export const orderService = new OrderService();