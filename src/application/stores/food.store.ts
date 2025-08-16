import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICartItem, IFood } from '../../presentation/types';
import { api, Food } from '../../api';

export interface FoodState {
  foodItems: IFood[];
  cart: ICartItem[];
  totalCartItems: number;
  totalPrice: number;
  selectedFood: IFood | null;
  cutleryCount: number;
  promoCode?: string;
  discount: number;
  deliveryFee: number;
  setFoodItems: (items: IFood[]) => void;
  loadFoodsFromApi: () => Promise<void>;
  addFoodToCart: (id: string) => void;
  removeFoodFromCart: (id: string) => void;
  clearCart: () => void;
  selectFood: (id: string) => void;
  addMenuItem: (item: IFood) => void;
  updateMenuItem: (id: string, updatedItem: IFood) => void;
  deleteMenuItem: (id: string) => void;
  updateCartItemSpecialRequest: (id: string, request: string) => void;
  setCutleryCount: (count: number) => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  createOrder: (orderData: any) => Promise<boolean>;
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foodItems: [],
      cart: [],
      totalCartItems: 0,
      totalPrice: 0,
      selectedFood: null,
      cutleryCount: 0,
      promoCode: undefined,
      discount: 0,
      deliveryFee: 0,

      setFoodItems: (items: IFood[]) => set({ foodItems: items }),

      loadFoodsFromApi: async () => {
        try {
          const response = await api.food.getAllFoods();
          if (response.success && response.data) {
            // Map API food data to local IFood interface
            const mappedFoods: IFood[] = response.data.map((apiFood: Food) => ({
              id: apiFood.id || apiFood._id, // Use custom id if available, fallback to _id
              name: apiFood.name,
              description: apiFood.description,
              price: apiFood.price,
              category: apiFood.category,
              imageUrl: apiFood.imageUrl || apiFood.image || '',
              ingredients: apiFood.ingredients,
              allergens: apiFood.allergens,
              nutritionalInfo: apiFood.nutritionalInfo,
              preparationTime: apiFood.preparationTime,
              isVegetarian: apiFood.isVegetarian,
              isVegan: apiFood.isVegan,
              isGlutenFree: apiFood.isGlutenFree,
              availability: apiFood.isAvailable,
              rating: apiFood.rating,
              reviewCount: apiFood.reviewCount,
              quantity: 10, // Default quantity for inventory
              deliveryTime: `${apiFood.preparationTime}-${apiFood.preparationTime + 5} min`, // Convert preparation time to delivery time
            }));
            set({ foodItems: mappedFoods });
          }
        } catch (error) {
          console.error('Failed to load foods from API:', error);
        }
      },

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
                specialRequest: '',
                requiresCutlery: false,
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

      updateCartItemSpecialRequest: (id: string, request: string) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, specialRequest: request } : item
          ),
        })),

      setCutleryCount: (count: number) => set({ cutleryCount: count }),

      applyPromoCode: async (code: string) => {
        try {
          const state = get();
          const response = await api.promo.validatePromoCode({
            code,
            orderValue: state.totalPrice
          });
          
          if (response.success && response.data.isValid) {
            set({ 
              promoCode: code.toUpperCase(),
              discount: response.data.discount
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Promo code validation error:', error);
          return false;
        }
      },

      removePromoCode: () => set({ promoCode: undefined, discount: 0 }),

      createOrder: async (orderData: any) => {
        try {
          const state = get();
          
          // Map cart items to API format
          const orderItems = state.cart.map(cartItem => ({
            foodId: cartItem.id,
            quantity: cartItem.quantity,
            price: cartItem.price,
            specialInstructions: cartItem.specialRequest
          }));

          const orderPayload = {
            items: orderItems,
            deliveryAddress: orderData.deliveryAddress,
            customerInfo: orderData.customerInfo,
            paymentMethod: orderData.paymentMethod || 'cash',
            promoCode: state.promoCode,
            specialInstructions: orderData.specialInstructions || '',
          };

          const response = await api.order.createOrder(orderPayload);
          
          if (response.success) {
            // Clear cart after successful order
            set({
              cart: [],
              totalCartItems: 0,
              totalPrice: 0,
              cutleryCount: 0,
              promoCode: undefined,
              discount: 0,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Order creation error:', error);
          return false;
        }
      },
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
        cutleryCount: state.cutleryCount,
        promoCode: state.promoCode,
        discount: state.discount,
        deliveryFee: state.deliveryFee,
      }),
    }
  )
);