import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
// import { FontSizes } from './theme';
import { FontSizes, FontWeights, Colors } from '../../../domain/enum/theme';
import { Intent, Size } from '../../../domain/enum/button';
import { Theme } from '../../theme/theme';
import SearchInput from '../../component/molecule/input/search-input';
import { useFoodStore } from '../../../application/stores/food.store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';
const { width } = Dimensions.get('window');

const PaymentSuccessScreen = () => {
  const { cart, totalPrice, totalCartItems } = useFoodStore();
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <View style={{ padding: 10, gap: 15, flex: 1 }}>

      <View >


        <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Theme.colors.gray}>
          Home
        </Typography>
          <Typography numberOfLines={1} weight={FontWeights.Bold}>
            Bole, Addis Ababa, Ethiopia
          </Typography>
      </View>
      <View>
        <SearchInput />
      </View>

      <SwipableModal visible={true} onClose={() => { }}>
        <View style={styles.container}>
          {/* Date and Time */}
          <Typography
            size={FontSizes.Small}
            align="center"
            weight={FontWeights.Regular}
            style={styles.dateText}
          >
            27 AUG 2024, 5:16 PM
          </Typography>

          {/* Success Icon */}
          <View style={styles.successIcon}>
            <View style={styles.checkmark} />
          </View>

          {/* Payment Amount */}
          <Typography
            size={FontSizes.ExtraLarge}
            align="center"
            weight={FontWeights.Bold}
            style={styles.amountText}
          >
            {totalPrice} ETB
          </Typography>

          {/* Success Message */}
          <Typography
            size={FontSizes.Regular}
            align="center"
            weight={FontWeights.Regular}
            style={styles.successMessage}
          >
            Payment was processed successfully
          </Typography>

          {/* Button */}
          <Button
            intent={Intent.Secondary}
            text="Go To Order Tracking"
            onPress={() => navigation.navigate(HomeScreens.Delivery)}
            style={{ backgroundColor: Theme.colors.GrayLight, borderRadius: 50, width: '100%' }}
            size={Size.Large}
            textStyle={{ color: Theme.colors.black, fontWeight: FontWeights.Bold }}

          />
        </View>
      </SwipableModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dateText: {
    marginBottom: 20,
    color: Colors.gray,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.LightGreen,
    ...commonStyles.centered,
    marginBottom: 16,
  },
  checkmark: {
    width: 32,
    height: 16,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.white,
    transform: [{ rotate: '-45deg' }],
  },
  amountText: {
    marginBottom: 8,
    color: Colors.black,
    fontWeight: FontWeights.Bold,
    fontSize: 50,
  },
  successMessage: {
    marginBottom: 24,
    color: Colors.GrayDark,
  },
  trackingButton: {
    backgroundColor: Colors.Primary,
    width: width * 0.8,
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default PaymentSuccessScreen;
