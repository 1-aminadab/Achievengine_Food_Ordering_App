import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartState, IFood } from '../../../../presentation/types';



const initialState: ICartState = {
  foodItems: [],
  cart: [],
  totalCartItems: 0,
  totalPrice: 0,
  selectedFood: null,
};

const foodCartSlice = createSlice({
  name: 'foodCart',
  initialState,
  reducers: {
    setFoodItems(state, action: PayloadAction<IFood[]>) {
      state.foodItems = action.payload;
    },

    addFoodToCart(state, action: PayloadAction<{ id: string }>) {
      const food = state.foodItems.find((f) => f.id === action.payload.id);
      if (food && food.quantity > 0 && food.availability) {
        const cartItem = state.cart.find((item) => item.id === food.id);
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          state.cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            imageUrl: food.imageUrl,
            quantity: 1,
          });
        }
        food.quantity -= 1;
      }
      state.totalCartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    removeFoodFromCart(state, action: PayloadAction<{ id: string }>) {
      const cartItemIndex = state.cart.findIndex((item) => item.id === action.payload.id);
      if (cartItemIndex !== -1) {
        const cartItem = state.cart[cartItemIndex];
        const food = state.foodItems.find((f) => f.id === cartItem.id);

        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          state.cart.splice(cartItemIndex, 1);
        }

        if (food) {
          food.quantity += 1;
        }
      }
      state.totalCartItems = state.cart.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },

    clearCart(state) {
      // Restore stock quantities
      state.cart.forEach((cartItem) => {
        const food = state.foodItems.find((f) => f.id === cartItem.id);
        if (food) {
          food.quantity += cartItem.quantity;
        }
      });

      state.cart = [];
      state.totalCartItems = 0;
      state.totalPrice = 0;
    },
    selectFood(state, action: PayloadAction<{ id: string }>) {      
        const food = state.foodItems.find((f) => f.id === action.payload.id);
        
        if (food) {
          state.selectedFood = food;
        } else {
          state.selectedFood = null;
        }
      },

      clearSelectedFood(state) {
        state.selectedFood = null;
      },

  },
});

export const {
  setFoodItems,
  addFoodToCart,
  removeFoodFromCart,
  clearCart,
  selectFood
} = foodCartSlice.actions;

export default foodCartSlice.reducer;
