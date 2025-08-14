import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Typography from '../../component/atom/typography/text.component';
import { FontSizes, FontWeights } from '../../../domain/enum/theme';
import { Theme } from '../../theme/theme';
import Button from '../../component/atom/button/button.component';
import { Size } from '../../../domain/enum/button';
import { NavComponent } from '../../../presentation/component/molecule/card/nav-card.component';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../application/stores/store';
import { ICartItem, IFood } from '../../types';
import { addFoodToCart, clearCart, removeFoodFromCart } from '../../../application/stores/slices/food/food.slice';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import HomeScreen from './home.screen';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';

// Individual Cart Item Component
const CartItem = ({ item, onQuantityChange, totalItems }: { item: ICartItem }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleIncrement = (id: string) => {
    dispatch(addFoodToCart({ id }));
    setQuantity(quantity + 1);
    // onQuantityChange(item.price);
  };

  const handleDecrement = (id: string) => {
    dispatch(removeFoodFromCart({ id }));

    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Typography color={Theme.colors.black} weight={FontWeights.Bold} size={FontSizes.Large}>{item.name}</Typography>
        <Typography weight={FontWeights.Bold} color={Theme.colors.gray}>{'No description'}</Typography>
        <Typography size={FontSizes.Large} weight={FontWeights.Bold} color={Theme.colors.GrayLight}>
          Edit Special Request
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography weight={FontWeights.Bold} size={FontSizes.Medium} >{item.price} ETB</Typography>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => handleDecrement(item.id)} style={styles.controlButton}>
              <Text style={styles.controlText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleIncrement(item.id)} style={styles.controlButton}>
              <Text style={styles.controlText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>


    </View>
  );
};

// Main Cart Screen Component
const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const { cart, totalPrice, totalCartItems } = useSelector((state: RootState) => state.food);
  const handleQuantityChange = (change) => {
    setTotal(total + change);
  };

  useEffect(() => {
    if(totalCartItems === 0) {
      navigation.goBack();
    }
  }, [totalCartItems, navigation]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon  from={IconLibraryName.Ionicons} name="close" size={24} color={Theme.colors.black} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity>
          <Icon from={IconLibraryName.MaterialCommunityIcons} name="delete-outline" size={27} color={Theme.colors.black} onPress={() => {
            dispatch(clearCart());
            navigation.goBack()
            }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartList}>
        {cart.map((item) => (
          <CartItem key={item.id} item={item} onQuantityChange={handleQuantityChange} />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: 'white', marginTop: 2 }}>


        <NavComponent
          title="Voture Applied"
          icon={<Icon from={IconLibraryName.Ionicons} name="film" size={25} color={Theme.colors.black} />}
          description=""
          navItem={<View style={{ backgroundColor: Theme.colors.LightGreen + '66', padding: 7, borderRadius: 20 }}>
            <Typography weight={FontWeights.Bold}>
              WellCome
            </Typography>
          </View>}
        />

      </View>
      <View style={styles.footer}>
        <View style={{ borderBottomWidth: 1,borderBottomColor:Theme.colors.GrayLight, padding: 10 }}>
          <NavComponent
            title="Cuttery"
            icon={<Icon from={IconLibraryName.MaterialCommunityIcons} name="silverware-fork-knife" size={25} color={Theme.colors.black} />}
            isNav={false}
            description="you have selected"
            navItem={<View style={{ backgroundColor: Theme.colors.black, padding: 15, flexDirection: 'row', gap: 10, borderRadius: 30 }}>
              <Typography weight={FontWeights.Bold} color={Theme.colors.white}>
                2 sets
              </Typography>
              <Icon from={IconLibraryName.Feather} name="edit-2" size={22} color={Theme.colors.white} />

            </View>}
          />
        </View>
        <View style={styles.footerRow}>
          <Typography color={Theme.colors.LightGreen} >Delivery Fee</Typography>
          <Typography color={Theme.colors.LightGreen} >0 ETB</Typography>
        </View>
        <View style={styles.footerRow}>
          <Typography style={styles.footerLabel}>Total</Typography>
          <Typography style={styles.footerTotal}>{totalPrice.toFixed(2)} ETB</Typography>
        </View>
        <Button onPress={() => navigation.navigate(HomeScreens.ConfirmDelivery)} text="Go to Checkout" size={Size.Large} style={{ borderRadius: 50 }} icon />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.GrayLight+'77',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    color: '#ff3d00',
    fontSize: 14,
  },
  cartList: {
    padding: 10,
    backgroundColor: Theme.colors.white,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 12,
    color: 'gray',
    marginVertical: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  quantityControls: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.GrayLight + '99',
    borderRadius: 20,
    alignItems: 'center',
  },
  controlButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    // backgroundColor: '#f0f0f0',
    ...commonStyles.centered,
    
  },
  controlText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  footerLabel: {
    fontSize: 14,
    color: 'gray',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#ff3d00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CartScreen;
