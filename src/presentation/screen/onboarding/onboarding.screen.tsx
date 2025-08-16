import React, { useState, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View, SafeAreaView } from 'react-native';
import { Theme } from '../../theme/theme';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
import { Intent } from '../../../domain/enum/button';
import { FontSizes, FontWeights } from '../../../domain/enum/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreens, RootScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';

const { width, height } = Dimensions.get('window');

const languages = [
  { id: '1', language: 'English' },
  { id: '2', language: 'አማርኛ' }, 
];

const OnboardingScreen = () => {
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialScreen(false);
      setLangModalVisible(true);
    }, 2000); // Show the modal after 2 seconds
    return () => clearTimeout(timer);
  }, []);
  const navigation  = useNavigation();

  if (showInitialScreen) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.initialScreen]}>
        <View style={[styles.container, styles.initialScreen]}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              style={styles.initialLogo}
              source={require('../../assets/images/logo.png')}
            />
          </View>

          {/* Footer Text */}
          <View style={styles.footerContainer}>
            <View>
              <Image
                style={{ height: 20, width: 20, borderRadius: 50 }}
                source={require('../../assets/images/red-logo.png')}
              />
            </View>
            <Typography
              size={FontSizes.Small}
              weight={FontWeights.Regular}
              style={styles.footerText}
            >
              Made in Ethiopia with love ❤️
            </Typography>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Main Logo */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.initialLogo}
            source={require('../../assets/images/logo.png')}
          />
        </View>

        {/* Language Selection Modal */}
        <SwipableModal visible={langModalVisible}>
          <View style={styles.modalContainer}>
            <Typography size={FontSizes.Medium} weight={FontWeights.Bold}>
              Select Your Language
            </Typography>
            <View style={styles.langButtons}>
              {languages.map((lang) => (
                <Button
                  key={lang.id}
                  fullWidth
                  onPress={() => navigation.navigate(RootScreens.Auth, { screen: AuthScreens.Phone as never })}
                  text={lang.language}
                  intent={Intent.Text}
                  textStyle={{ color: Theme.colors.black }}
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: Theme.colors.GrayLight,
                    alignItems: "flex-start",
                    height: 50,
                  }}
                />
              ))}
            </View>
          </View>
        </SwipableModal>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.PrimaryDark,
  },
  container: {
    backgroundColor: Theme.colors.PrimaryDark,
    height: '100%',
    width: '100%',
  },
  logoContainer: {
    flex: 1,
    marginBottom: 300,
    elevation: 10,
   
    ...commonStyles.centered,
  },
  initialLogo: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
     borderRadius: 300,
    overflow: 'hidden',
  },
  logo: {
    height: 110,
    width: 130,
    resizeMode: 'contain',
  },
  modalContainer: {
    alignItems: 'flex-start',
    paddingVertical: 25,
    gap: 10,
  },
  langButtons: {
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  initialScreen: {
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  footerContainer: {
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 30,
    alignItems: "center",
    justifyContent: 'flex-start',
    flexDirection: "row",
    gap: 5,
    margin: 10,
  },
  footerText: {
    color: Theme.colors.black,
    backgroundColor: Theme.colors.white,
    borderRadius: 15,
    borderBottomLeftRadius: 2,
    padding: 7,
    textAlign: 'center',
  },
});
