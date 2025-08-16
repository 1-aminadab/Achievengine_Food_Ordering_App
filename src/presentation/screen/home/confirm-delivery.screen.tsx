import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import SwipableModal from '../../component/molecule/modal/swipeable-modal';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
import { FontSizes, FontWeights, Colors } from '../../../domain/enum/theme';
import { Intent, Size } from '../../../domain/enum/button';
import { Theme } from '../../theme/theme';
import SearchInput from '../../component/molecule/input/search-input';
import { useFoodStore } from '../../../application/stores/food.store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';
const { width } = Dimensions.get('window');

const ConfirmDeliveryScreen = () => {
  const { cart, totalPrice, totalCartItems, deliveryFee, discount } = useFoodStore();
  const navigation = useNavigation<NavigationProp<any>>();
  
  const subtotal = totalPrice - deliveryFee - discount;
  const estimatedDeliveryTime = "25-35 minutes";
  const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Theme.colors.gray}>
          Order Confirmation
        </Typography>
        <Typography numberOfLines={1} weight={FontWeights.Bold} size={FontSizes.Regular}>
          Bole, Addis Ababa, Ethiopia
        </Typography>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchInput />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.successIcon}>
              <View style={styles.checkmark} />
            </View>
            <View style={styles.statusText}>
              <Typography size={FontSizes.Large} weight={FontWeights.Bold} color={Colors.LightGreen}>
                Order Confirmed!
              </Typography>
              <Typography size={FontSizes.Small} color={Colors.gray}>
                Your order has been placed successfully
              </Typography>
            </View>
          </View>
          <Typography size={FontSizes.Small} color={Colors.gray} style={styles.orderNumber}>
            Order #{orderNumber}
          </Typography>
        </View>

        {/* Delivery Info Card */}
        <View style={styles.infoCard}>
          <Typography size={FontSizes.Medium} weight={FontWeights.Bold} style={styles.cardTitle}>
            Delivery Information
          </Typography>
          <View style={styles.deliveryInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Colors.white}>
                  🕒
                </Typography>
              </View>
              <View style={styles.infoContent}>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                  Estimated Delivery
                </Typography>
                <Typography size={FontSizes.Small} color={Colors.gray}>
                  {estimatedDeliveryTime}
                </Typography>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Colors.white}>
                  📍
                </Typography>
              </View>
              <View style={styles.infoContent}>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                  Delivery Address
                </Typography>
                <Typography size={FontSizes.Small} color={Colors.gray}>
                  Bole, Addis Ababa, Ethiopia
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items Card */}
        <View style={styles.infoCard}>
          <Typography size={FontSizes.Medium} weight={FontWeights.Bold} style={styles.cardTitle}>
            Order Items ({totalCartItems})
          </Typography>
          <View style={styles.itemsContainer}>
            {cart.map((item, index) => (
              <View key={item.id} style={styles.itemRow}>
                <Image 
                  source={{ uri: item.imageUrl }} 
                  style={styles.itemImage}
                  defaultSource={require('../../assets/images/logo.png')}
                />
                <View style={styles.itemDetails}>
                  <Typography size={FontSizes.Small} weight={FontWeights.Bold} numberOfLines={1}>
                    {item.name}
                  </Typography>
                  <Typography size={FontSizes.Small} color={Colors.gray}>
                    Qty: {item.quantity}
                  </Typography>
                  {item.specialRequest && (
                    <Typography size={FontSizes.Small} color={Colors.gray} numberOfLines={1}>
                      Note: {item.specialRequest}
                    </Typography>
                  )}
                </View>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                  {(item.price * item.quantity).toFixed(2)} ETB
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary Card */}
        <View style={styles.infoCard}>
          <Typography size={FontSizes.Medium} weight={FontWeights.Bold} style={styles.cardTitle}>
            Payment Summary
          </Typography>
          <View style={styles.paymentSummary}>
            <View style={styles.summaryRow}>
              <Typography size={FontSizes.Small} color={Colors.gray}>
                Subtotal
              </Typography>
              <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                {subtotal.toFixed(2)} ETB
              </Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography size={FontSizes.Small} color={Colors.gray}>
                Delivery Fee
              </Typography>
              <Typography size={FontSizes.Small} weight={FontWeights.Bold}>
                {deliveryFee.toFixed(2)} ETB
              </Typography>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Typography size={FontSizes.Small} color={Colors.LightGreen}>
                  Discount
                </Typography>
                <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Colors.LightGreen}>
                  -{discount.toFixed(2)} ETB
                </Typography>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Typography size={FontSizes.Medium} weight={FontWeights.Bold}>
                Total
              </Typography>
              <Typography size={FontSizes.Medium} weight={FontWeights.Bold} color={Colors.Primary}>
                {totalPrice.toFixed(2)} ETB
              </Typography>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            intent={Intent.Primary}
            text="Track Order"
            onPress={() => navigation.navigate(HomeScreens.Delivery)}
            style={styles.trackButton}
            size={Size.Large}
            textStyle={{ fontWeight: FontWeights.Bold }}
          />
          <Button
            intent={Intent.Secondary}
            text="Back to Home"
            onPress={() => navigation.navigate(HomeScreens.Home)}
            style={styles.homeButton}
            size={Size.Large}
            textStyle={{ color: Theme.colors.black, fontWeight: FontWeights.Bold }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.LightGreen,
    ...commonStyles.centered,
    marginRight: 16,
  },
  checkmark: {
    width: 24,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.white,
    transform: [{ rotate: '-45deg' }],
  },
  statusText: {
    flex: 1,
  },
  orderNumber: {
    textAlign: 'center',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
    color: Colors.black,
  },
  deliveryInfo: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.Primary,
    ...commonStyles.centered,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  paymentSummary: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray,
    marginVertical: 8,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 30,
  },
  trackButton: {
    borderRadius: 12,
    backgroundColor: Colors.Primary,
  },
  homeButton: {
    borderRadius: 12,
    backgroundColor: Colors.GrayLight,
  },
});

export default ConfirmDeliveryScreen;
