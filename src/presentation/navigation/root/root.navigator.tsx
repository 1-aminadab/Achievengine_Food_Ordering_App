import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { HomeNavigator } from '../stack/home/home.navigation';
import { OnboardingNavigator } from '../stack/onboarding/onboarding.navigation';
import { AuthNavigator } from '../stack/auth/auth.navigation';
import { RootScreens } from '../../../domain/enum/screen-name';
import MainTabNavigator from '../tab/tab.navigation';
import { useThemeContext } from '../../theme/theme-provider';

const RootStack = createNativeStackNavigator();
export const RootNavigator = () => {
  const { mode } = useThemeContext();
  const theme: NavTheme = mode === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={theme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={RootScreens.Onboarding} component={OnboardingNavigator} />
        <RootStack.Screen name={RootScreens.Home} component={MainTabNavigator} />
        <RootStack.Screen name={RootScreens.Auth} component={AuthNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
