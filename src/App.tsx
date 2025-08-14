import React from 'react';
import { RootNavigator } from './presentation/navigation/root/root.navigator';
// Removed Redux Provider in favor of Zustand
import { ThemeProvider } from './presentation/theme/theme-provider';

const App = () => {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
};

export default App;
