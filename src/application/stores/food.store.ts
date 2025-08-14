import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICartItem, IFood } from '../../presentation/types';

export interface FoodState {
  foodItems: IFood[];
  cart: ICartItem[];
  totalCartItems: number;
  totalPrice: number;
  selectedFood: IFood | null;
  setFoodItems: (items: IFood[]) => void;
  addFoodToCart: (id: string) => void;
  removeFoodFromCart: (id: string) => void;
  clearCart: () => void;
  selectFood: (id: string) => void;
  addMenuItem: (item: IFood) => void;
  updateMenuItem: (id: string, updatedItem: IFood) => void;
  deleteMenuItem: (id: string) => void;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foodItems: [],
      cart: [],
      totalCartItems: 0,
      totalPrice: 0,
      selectedFood: null,

      setFoodItems: (items: IFood[]) => set({ foodItems: items }),

      addFoodToCart: (id: string) =>
        set((state) => {
          const food = state.foodItems.find((f) => f.id === id);
          if (!food || !food.availability || food.quantity <= 0) {
            return state;
          }

          const existing = state.cart.find((c) => c.id === id);
          let newCart: ICartItem[];
          if (existing) {
            newCart = state.cart.map((c) =>
              c.id === id ? { ...c, quantity: c.quantity + 1 } : c
            );
          } else {
            newCart = [
              ...state.cart,
              {
                id: food.id,
                name: food.name,
                price: food.price,
                imageUrl: food.imageUrl,
                quantity: 1,
              },
            ];
          }

          const updatedFoodItems = state.foodItems.map((f) =>
            f.id === id ? { ...f, quantity: f.quantity - 1 } : f
          );

          const totalCartItems = newCart.reduce((t, i) => t + i.quantity, 0);
          const totalPrice = newCart.reduce((t, i) => t + i.price * i.quantity, 0);

          return {
            foodItems: updatedFoodItems,
            cart: newCart,
            totalCartItems,
            totalPrice,
          };
        }),

      removeFoodFromCart: (id: string) =>
        set((state) => {
          const cartIndex = state.cart.findIndex((c) => c.id === id);
          if (cartIndex === -1) return state;

          const cartItem = state.cart[cartIndex];
          let newCart: ICartItem[] = [...state.cart];
          if (cartItem.quantity > 1) {
            newCart[cartIndex] = { ...cartItem, quantity: cartItem.quantity - 1 };
          } else {
            newCart.splice(cartIndex, 1);
          }

          const updatedFoodItems = state.foodItems.map((f) =>
            f.id === id ? { ...f, quantity: f.quantity + 1 } : f
          );

          const totalCartItems = newCart.reduce((t, i) => t + i.quantity, 0);
          const totalPrice = newCart.reduce((t, i) => t + i.price * i.quantity, 0);

          return {
            foodItems: updatedFoodItems,
            cart: newCart,
            totalCartItems,
            totalPrice,
          };
        }),

      clearCart: () =>
        set((state) => {
          const restoredFood = state.foodItems.map((f) => {
            const inCart = state.cart.find((c) => c.id === f.id);
            if (!inCart) return f;
            return { ...f, quantity: f.quantity + inCart.quantity };
          });
          return {
            foodItems: restoredFood,
            cart: [],
            totalCartItems: 0,
            totalPrice: 0,
          };
        }),

      selectFood: (id: string) =>
        set((state) => {
          const found = state.foodItems.find((f) => f.id === id) || null;
          return { selectedFood: found };
        }),

      addMenuItem: (item: IFood) =>
        set((state) => ({
          foodItems: [...state.foodItems, item],
        })),

      updateMenuItem: (id: string, updatedItem: IFood) =>
        set((state) => ({
          foodItems: state.foodItems.map((item) =>
            item.id === id ? updatedItem : item
          ),
          selectedFood: state.selectedFood?.id === id ? updatedItem : state.selectedFood,
        })),

      deleteMenuItem: (id: string) =>
        set((state) => ({
          foodItems: state.foodItems.filter((item) => item.id !== id),
          cart: state.cart.filter((item) => item.id !== id),
          selectedFood: state.selectedFood?.id === id ? null : state.selectedFood,
        })),
    }),
    {
      name: 'food-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        foodItems: state.foodItems,
        cart: state.cart,
        totalCartItems: state.totalCartItems,
        totalPrice: state.totalPrice,
        selectedFood: state.selectedFood,
      }),
    }
  )
);

