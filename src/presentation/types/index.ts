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
  }

  export interface ICartState {
    foodItems: IFood[];
    cart: ICartItem[];
    totalCartItems: number;
    totalPrice: number;
    selectedFood:IFood | null;
  }
