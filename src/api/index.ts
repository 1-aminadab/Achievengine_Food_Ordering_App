// Import all API services
import { foodService } from './services/food.service';
import { orderService } from './services/order.service';
import { promoService } from './services/promo.service';
import { uploadService } from './services/upload.service';
import { authService } from './services/auth.service';

// Export all API services
export { foodService } from './services/food.service';
export { orderService } from './services/order.service';
export { promoService } from './services/promo.service';
export { uploadService } from './services/upload.service';
export { authService } from './services/auth.service';

// Export configuration and utilities
export { apiClient, API_CONFIG } from './config';

// Export types
export * from './types';

// Export a centralized API object for easy access
export const api = {
  food: foodService,
  order: orderService,
  promo: promoService,
  upload: uploadService,
  auth: authService,
};