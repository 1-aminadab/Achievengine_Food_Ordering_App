import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import Header from '../../component/molecule/card/header.component';
import Typography from '../../component/atom/typography/text.component';
import { FontSizes } from '../../../domain/enum/theme';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Theme } from '../../theme/theme';
import Button from '../../component/atom/button/button.component';
import { Size } from '../../../domain/enum/button';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../theme/theme-provider';
import { AuthScreens } from '../../../domain/enum/screen-name';

const countries = [
  { name: 'Ethiopia', code: '+251', flag: '🇪🇹' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
  { name: 'Somalia', code: '+252', flag: '🇸🇴' },
  { name: 'South Sudan', code: '+211', flag: '🇸🇸' },
  { name: 'Eritrea', code: '+291', flag: '🇪🇷' },
];

const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Ethiopia
  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const validatePhoneNumber = (number: string): boolean => {
    const minLength = 8;
    const maxLength = 15;
    const regex = /^[0-9]+$/;
    return regex.test(number) && number.length >= minLength && number.length <= maxLength;
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);

    if (errorMessage) setErrorMessage('');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const selectCountry = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const toVerifyOtp = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate(AuthScreens.OTP as never);
    }, 4000);
  };

  const isButtonDisabled = phoneNumber.trim() === '' || !validatePhoneNumber(phoneNumber);

  const { colors } = useThemeContext();
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isModalVisible ? (colors.background) : colors.background }]}
      behavior="padding"
    >
      <Header />
      {/* Title */}
      <Typography size={FontSizes.ExtraLarge} style={styles.title}>
        Login or create an account
      </Typography>

      {/* Input Section */}
      <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={openModal} style={styles.countryCode}>
          <Text style={[styles.countryCodeText, { color: colors.text }]}>
            {selectedCountry.flag} {selectedCountry.code}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Enter your phone number"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
        />
      </View>

      {/* Error Message */}
      {errorMessage ? <Text style={[styles.errorText, { color: 'red' }]}>{errorMessage}</Text> : null}

      {/* Continue Button */}
      <Button
        isLoading={isLoading}
        size={Size.Large}
        style={{ borderRadius: 15, height: 55 }}
        disabled={isButtonDisabled}
        onPress={toVerifyOtp}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Button>

      {/* Modal for Country Selection */}
      <SwipableModal visible={isModalVisible} onClose={() => setModalVisible(false)}>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={[styles.modalHeader, { color: colors.text }]}>Choose country</Text>
        </View>
        {countries.map((country) => (
          <TouchableOpacity
            key={country.code}
            style={styles.countryRow}
            onPress={() => selectCountry(country)}
          >
            <Text
              style={[
                styles.countryText,
                { color: colors.text },
                selectedCountry.code === country.code && styles.selectedCountry,
              ]}
            >
              {country.flag} {country.name}
            </Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text style={{ fontWeight: 'bold', color: colors.text }}>{country.code}</Text>
              {selectedCountry.code === country.code && (
                <Icon
                  from={IconLibraryName.MaterialIcons}
                  name="done"
                  size={20}
                  color={Theme.colors.Primary}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </SwipableModal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  countryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 7,
  },
  countryText: {
    fontSize: 16,
  },
  selectedCountry: {
    color: 'rgb(248, 109, 109)',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default PhoneNumberInput;
