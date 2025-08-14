// store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodReducer from './slices/food/food.slice';
// Import your slices here

// Define the shape of the root state
export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  food: foodReducer
});

// Configure Persist
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'rent','transactions'], 
  blacklist: ['navigation'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // Uncomment the following lines to enable Redux DevTools Extension
  // devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
