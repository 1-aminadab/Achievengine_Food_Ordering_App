import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Keyboard,
  Animated,
} from 'react-native';
import Typography from '../../component/atom/typography/text.component';
import { Colors, FontSizes, FontWeights } from '../../../domain/enum/theme';
import Header from '../../component/molecule/card/header.component';
import { useNavigation } from '@react-navigation/native';
import { AuthScreens } from '../../../domain/enum/screen-name';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(29);
  const [resendVisible, setResendVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setResendVisible(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleResend = () => {
    Alert.alert('Verification Code', 'We have sent a verification code to your phone number.');
    setTimer(29);
    setResendVisible(false);
  };

  const handleOtpChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setOtp(numericValue);

    if (numericValue.length === 6) {
      if (numericValue === '123456') {
        navigation.navigate(AuthScreens.Register as never);
      } else {
        triggerShakeAnimation();
        setOtp('');
      }
    }
  };

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const formatOtp = (value: string): string => {
    const paddedValue = value.padEnd(6, '\u22C5');
    const spacedValue = paddedValue.split('').join(' ');
    const formatted = `${spacedValue.slice(0, 5)} ${spacedValue.slice(5)}`;
    return formatted;
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={{ flex: 1, marginTop: 80 }}>
        <Typography size={FontSizes.ExtraLarge} weight={FontWeights.Bold} align="center" style={styles.title}>
          Enter Code
        </Typography>
        <Typography size={14} align="center"  weight={FontWeights.Bold} color={Colors.black}>
          We've sent the 6-digit code to
        </Typography>
        <Typography size={14} align="center"  weight={FontWeights.Bold} color={Colors.black}>
          +974 •••• ••••
        </Typography>

        {/* Hidden TextInput */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={handleOtpChange}
          autoFocus
        />

        {/* Clickable Formatted OTP */}
        <TouchableOpacity style={{marginTop:50}} onPress={() => inputRef.current?.focus()}>
          <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
            <Typography size={24} align="center" style={styles.formattedOtp}>
              {formatOtp(otp)}
            </Typography>
          </Animated.View>
        </TouchableOpacity>

        {resendVisible ? (
          <TouchableOpacity onPress={handleResend}>
            <Typography size={16} align="center" style={styles.resendText}>
              Resend Code
            </Typography>
          </TouchableOpacity>
        ) : (
          <Typography size={12} align="center" style={styles.timer}>
            Request a new code in 0:{timer.toString().padStart(2, '0')}
          </Typography>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    color: '#888',
  },
  hiddenInput: {
    opacity: 0,
    position: 'absolute',
    width: 1,
    height: 1,
    marginTop:100
  },
  formattedOtp: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 5,
    marginBottom: 24,
    color: '#000',
  },
  timer: {
    marginBottom: 24,
    color: '#888',
  },
  resendText: {
    color: '#4caf50',
    fontWeight: 'bold',
    marginBottom: 24,
  },
});

export default OtpVerificationScreen;
