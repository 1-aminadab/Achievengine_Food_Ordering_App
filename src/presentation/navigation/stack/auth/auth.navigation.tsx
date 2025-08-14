import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OtpVerificationScreen, PhoneScreen, RegistrationScreen } from '../../../screen/auth';
import { AuthScreens } from '../../../../domain/enum/screen-name';

const AuthStack = createNativeStackNavigator();
export const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name={AuthScreens.Register} component={RegistrationScreen} />
    <AuthStack.Screen name={AuthScreens.OTP} component={OtpVerificationScreen} />
    <AuthStack.Screen name={AuthScreens.Phone} component={PhoneScreen} />
  </AuthStack.Navigator>
);

