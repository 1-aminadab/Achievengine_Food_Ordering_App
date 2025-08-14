import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
import { FontWeights } from '../../../domain/enum/theme';
import Header from '../../component/molecule/card/header.component';
import { Size } from '../../../domain/enum/button';
import { useNavigation } from '@react-navigation/native';
import { OnboardingScreens, RootScreens } from '../../../domain/enum/screen-name';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inputFocus, setInputFocus] = useState(true);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const navigation = useNavigation()
  const validateName = (text: string) => {
    setName(text);
    setIsNameValid(text.length >= 3 && text.length <= 50);
  };

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(text) && text.length <= 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Register" />

      <View style={styles.formContainer}>
        {/* Name Input */}
        <TextInput
     
          label="Name"
          mode="flat"
          value={name}
          onChangeText={validateName}
          style={[
            styles.input,
            {
              borderColor: !isNameValid && name ? '#FF0000' : 'transparent',
            },
          ]}
          placeholder="Enter your name"
          maxLength={50}
          theme={{
            
            colors: {
              primary: '#000',
              text: 'black',
              background: 'transparent',
            },
          }}
        />

        {/* Email Input */}
        <TextInput
          
          label="E-mail"
          mode="flat"
          value={email}
          onChangeText={validateEmail}
          style={[
            styles.input,
            {
              borderColor: !isEmailValid && email ? '#FF0000' : 'transparent',
            },
          ]}
          keyboardType="email-address"
          placeholder="Enter your email"
          maxLength={100}
          
          theme={{
            colors: {
              primary: '#000',
              text: 'black',
              background: 'transparent',
            },
          }}
        />

        {/* Validation Info Text */}
        <Typography
          size={12}
          align="center"
          style={[styles.infoText, { display: inputFocus ? 'flex' : 'none' }]}
        >
          Communications and transaction history from the app will be sent to the verified email
          address.
        </Typography>

        {/* Promo Banner */}
        {!isNameValid || !isEmailValid ? (
          <View style={styles.promoContainer}>
            <Typography size={14} align="center" style={styles.promoText}>
              FREE delivery just for you! 🔥 Use code{' '}
              <Typography weight={FontWeights.Bold}>WELCOME</Typography> and redeem it now!
            </Typography>
          </View>
        ) : null}
      </View>

      {/* Register Button */}
      <Button
        text="Register"
        onPress={() => {
          navigation.navigate(RootScreens.Onboarding, {screen: OnboardingScreens.Location})
        }}
        fullWidth
        size={Size.Large}
        disabled={!isNameValid || !isEmailValid}
        style={[
          styles.button,
          {
            backgroundColor: isNameValid && isEmailValid ? '#B00020' : '#E0E0E0',
          },
        ]}
        textStyle={{
          color: isNameValid && isEmailValid ? '#FFF' : '#A0A0A0',
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  formContainer: {
    marginTop: 100,
    flex: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 15,
    borderTopEndRadius:20,
    borderTopStartRadius:20,
    paddingHorizontal: 20,
    elevation: 0,
  },
  infoText: {
    marginTop: 8,
    marginBottom: 16,
    color: '#888',
  },
  button: {
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 25,
  },
  promoContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },
  promoText: {
    color: '#B71C1C',
  },
});

export default RegisterScreen;
