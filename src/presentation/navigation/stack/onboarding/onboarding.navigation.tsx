import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LocationScreen, OnboardingScreen } from '../../../screen/onboarding';
import { OnboardingScreens } from '../../../../domain/enum/screen-name';

const OnboardingStack = createNativeStackNavigator();
export const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name={OnboardingScreens.Onboarding} component={OnboardingScreen} />
    <OnboardingStack.Screen name={OnboardingScreens.Location} component={LocationScreen} />
  </OnboardingStack.Navigator>
);
