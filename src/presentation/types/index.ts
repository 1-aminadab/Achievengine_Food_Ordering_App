export interface IFood {
    id: string;
    name: string;
    price: number;
    description: string;
    availability: boolean;
    deliveryTime: string;
    imageUrl: string;
    quantity: number;
  }

  export interface ICartItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    specialRequest?: string;
    requiresCutlery?: boolean;
  }

  export interface ICartState {
    foodItems: IFood[];
    cart: ICartItem[];
    totalCartItems: number;
    totalPrice: number;
    selectedFood:IFood | null;
    cutleryCount: number;
    promoCode?: string;
    discount: number;
    deliveryFee: number;
  }

  export interface IPromoCode {
    code: string;
    discount: number;
    isPercentage: boolean;
    isValid: boolean;
  }
