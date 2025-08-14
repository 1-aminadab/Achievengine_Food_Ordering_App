import React, { useEffect } from 'react';
import { RootNavigator } from './presentation/navigation/root/root.navigator';
// Removed Redux Provider in favor of Zustand
import { ThemeProvider } from './presentation/theme/theme-provider';
import { useFoodStore } from './application/stores/food.store';
import { dummyFoods } from './application/data/dummy-data';

const AppContent = () => {
  const { foodItems, setFoodItems } = useFoodStore();

  useEffect(() => {
    // Initialize with dummy data if no food items exist
    if (foodItems.length === 0) {
      setFoodItems(dummyFoods);
    }
  }, [foodItems.length, setFoodItems]);

  return <RootNavigator />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
