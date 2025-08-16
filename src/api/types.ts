// Food Types
export interface Food {
  _id: string;
  id?: string; // Custom UUID field used by backend
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  availability?: boolean; // Backend field
  deliveryTime?: string; // Backend field
  quantity?: number; // Backend field
  restaurant?: string; // Backend field
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Very Hot'; // Backend field
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  deliveryTime: string;
  quantity: number;
  restaurant: string;
  availability: boolean;
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Very Hot';
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export interface UpdateFoodRequest extends Partial<CreateFoodRequest> {}

// Order Types
export interface OrderItem {
  foodId: string;
  food?: Food;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'digital_wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  promoCode?: string;
  rating?: {
    food: number;
    delivery: number;
    overall: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Omit<OrderItem, 'food'>[];
  deliveryAddress: Order['deliveryAddress'];
  customerInfo: Order['customerInfo'];
  paymentMethod: Order['paymentMethod'];
  promoCode?: string;
  specialInstructions?: string;
}

export interface UpdateOrderStatusRequest {
  status: Order['status'];
  estimatedDeliveryTime?: string;
}

export interface RateOrderRequest {
  food: number;
  delivery: number;
  overall: number;
  comment?: string;
}

// Promo Code Types
export interface PromoCode {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'free_delivery';
  value: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  applicableCategories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidatePromoCodeRequest {
  code: string;
  orderValue: number;
}

export interface ValidatePromoCodeResponse {
  isValid: boolean;
  discount: number;
  message: string;
  promoCode?: PromoCode;
}

// User Types (for future authentication)
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Order['deliveryAddress'][];
  preferences: {
    dietary: string[];
    allergens: string[];
  };
  orderHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Upload Types
export interface UploadImageResponse {
  filename: string;
  originalName: string;
  size: number;
  url: string;
}

// API Query Parameters
export interface FoodQueryParams {
  category?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'rating' | 'preparationTime';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderQueryParams {
  userId?: string;
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}