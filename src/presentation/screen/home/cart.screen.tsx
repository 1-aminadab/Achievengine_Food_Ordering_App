import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import { useThemeContext } from '../../theme/theme-provider';
import Typography from '../../component/atom/typography/text.component';
import { FontSizes, FontWeights } from '../../../domain/enum/theme';
import { Theme } from '../../theme/theme';
import Button from '../../component/atom/button/button.component';
import { Size } from '../../../domain/enum/button';
import { NavComponent } from '../../../presentation/component/molecule/card/nav-card.component';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { useFoodStore } from '../../../application/stores/food.store';
import { ICartItem, IFood } from '../../types';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import HomeScreen from './home.screen';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { commonStyles } from '../../styles/common-styles';
import CustomModal from '../../component/molecule/modal/custom-modal.component';

// Cutlery Selection Modal
const CutleryModal = ({ visible, onClose, currentCount, onSave }: {
  visible: boolean;
  onClose: () => void;
  currentCount: number;
  onSave: (count: number) => void;
}) => {
  const [count, setCount] = useState(currentCount);
  const { colors } = useThemeContext();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={styles.modalTitle}>Select Cutlery Sets</Text>
          <View style={styles.cutleryCounter}>
            <TouchableOpacity 
              onPress={() => setCount(Math.max(0, count - 1))}
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.cutleryCount}>{count} sets</Text>
            <TouchableOpacity 
              onPress={() => setCount(count + 1)}
              style={styles.counterButton}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onSave(count);
                onClose();
              }} 
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Special Request Modal
const SpecialRequestModal = ({ visible, onClose, currentRequest, itemName, onSave }: {
  visible: boolean;
  onClose: () => void;
  currentRequest: string;
  itemName: string;
  onSave: (request: string) => void;
}) => {
  const [request, setRequest] = useState(currentRequest);
  const { colors } = useThemeContext();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={styles.modalTitle}>Special Request for {itemName}</Text>
          <TextInput
            style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="Enter special instructions..."
            placeholderTextColor={colors.text + '80'}
            value={request}
            onChangeText={setRequest}
            multiline
            numberOfLines={4}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                onSave(request);
                onClose();
              }} 
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Promo Code Modal
const PromoCodeModal = ({ visible, onClose, onApply }: {
  visible: boolean;
  onClose: () => void;
  onApply: (code: string) => void;
}) => {
  const [code, setCode] = useState('');
  const { colors } = useThemeContext();

  const handleApply = () => {
    if (code.trim()) {
      onApply(code.trim());
      setCode('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={styles.modalTitle}>Enter Promo Code</Text>
          <TextInput
            style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
            placeholder="Enter promo code..."
            placeholderTextColor={colors.text + '80'}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <Text style={styles.promoHint}>Try: WELCOME, SAVE50, FIRST20</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.modalSaveButton}>
              <Text style={styles.modalSaveText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Individual Cart Item Component
const CartItem = ({ item }: { item: ICartItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [showSpecialRequest, setShowSpecialRequest] = useState(false);
  const { addFoodToCart, removeFoodFromCart, updateCartItemSpecialRequest } = useFoodStore();

  const handleIncrement = (id: string) => {
    addFoodToCart(id);
    setQuantity(quantity + 1);
  };

  const handleDecrement = (id: string) => {
    removeFoodFromCart(id);
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSpecialRequestSave = (request: string) => {
    updateCartItemSpecialRequest(item.id, request);
  };

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Typography color={Theme.colors.black} weight={FontWeights.Bold} size={FontSizes.Large}>
          {item.name}
        </Typography>
        <Typography weight={FontWeights.Bold} color={Theme.colors.gray}>
          {item.specialRequest || 'No special requests'}
        </Typography>
        <TouchableOpacity onPress={() => setShowSpecialRequest(true)}>
          <Typography size={FontSizes.Large} weight={FontWeights.Bold} color={Theme.colors.LightGreen}>
            Edit Special Request
          </Typography>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography weight={FontWeights.Bold} size={FontSizes.Medium}>{item.price} ETB</Typography>
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

      <SpecialRequestModal
        visible={showSpecialRequest}
        onClose={() => setShowSpecialRequest(false)}
        currentRequest={item.specialRequest || ''}
        itemName={item.name}
        onSave={handleSpecialRequestSave}
      />
    </View>
  );
};

// Main Cart Screen Component
const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { 
    cart, 
    totalPrice, 
    totalCartItems, 
    clearCart, 
    cutleryCount, 
    setCutleryCount,
    promoCode,
    discount,
    deliveryFee,
    applyPromoCode,
    removePromoCode
  } = useFoodStore();
  
  const [showCutleryModal, setShowCutleryModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    actions: Array<{text: string; onPress: () => void; style?: string}>;
  }>({
    visible: false,
    title: '',
    message: '',
    actions: []
  });

  const showModal = (title: string, message: string, actions: Array<{text: string; onPress: () => void; style?: string}> = []) => {
    setModalConfig({
      visible: true,
      title,
      message,
      actions: actions.length > 0 ? actions : [{ text: 'OK', onPress: () => hideModal() }]
    });
  };

  const hideModal = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if(totalCartItems === 0) {
      navigation.goBack();
    }
  }, [totalCartItems, navigation]);

  const handlePromoCodeApply = async (code: string) => {
    try {
      const success = await applyPromoCode(code);
      if (success) {
        showModal('Success!', `Promo code ${code} applied successfully!`);
      } else {
        showModal('Invalid Code', 'Please enter a valid promo code.');
      }
    } catch (error) {
      showModal('Error', 'Failed to validate promo code. Please try again.');
    }
  };

  const handleCutlerySave = (count: number) => {
    setCutleryCount(count);
    showModal('Cutlery Updated', `${count} sets of cutlery selected.`);
  };

  const finalTotal = totalPrice - discount + deliveryFee;
  const { colors } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Icon  
          from={IconLibraryName.Ionicons} 
          name="close" 
          size={24} 
          color={Theme.colors.black} 
          onPress={() => navigation.goBack()} 
        />
        <Text style={styles.headerTitle}>Cart ({totalCartItems} items)</Text>
        <TouchableOpacity onPress={() => {
          showModal(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
              { text: 'Cancel', onPress: () => hideModal(), style: 'cancel' },
              { 
                text: 'Clear', 
                style: 'destructive',
                onPress: () => {
                  hideModal();
                  clearCart();
                  navigation.goBack();
                }
              }
            ]
          );
        }}>
          <Icon 
            from={IconLibraryName.MaterialCommunityIcons} 
            name="delete-outline" 
            size={27} 
            color={Theme.colors.black} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.cartList, { backgroundColor: colors.card }]}>
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Promo Code Section */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 5, backgroundColor: colors.card, marginTop: 2 }}>
        <TouchableOpacity onPress={() => setShowPromoModal(true)}>
          <NavComponent
            title={promoCode ? `Promo: ${promoCode}` : "Apply Promo Code"}
            icon={<Icon from={IconLibraryName.Ionicons} name="pricetag" size={25} color={Theme.colors.black} />}
            description={promoCode ? `Saved ${discount.toFixed(2)} ETB` : "Tap to enter code"}
            navItem={
              promoCode ? (
                <TouchableOpacity onPress={() => removePromoCode()}>
                  <View style={{ backgroundColor: Theme.colors.red + '66', padding: 7, borderRadius: 20 }}>
                    <Typography weight={FontWeights.Bold} color={Theme.colors.red}>
                      Remove
                    </Typography>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{ backgroundColor: Theme.colors.LightGreen + '66', padding: 7, borderRadius: 20 }}>
                  <Typography weight={FontWeights.Bold}>
                    Apply
                  </Typography>
                </View>
              )
            }
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: Theme.colors.GrayLight, padding: 10 }}>
          <TouchableOpacity onPress={() => setShowCutleryModal(true)}>
            <NavComponent
              title="Cutlery"
              icon={<Icon from={IconLibraryName.MaterialCommunityIcons} name="silverware-fork-knife" size={25} color={Theme.colors.black} />}
              isNav={false}
              description={cutleryCount > 0 ? `${cutleryCount} sets selected` : "Tap to select"}
              navItem={
                <TouchableOpacity onPress={() => setShowCutleryModal(true)}>
                  <View style={{ backgroundColor: Theme.colors.black, padding: 15, flexDirection: 'row', gap: 10, borderRadius: 30 }}>
                    <Typography weight={FontWeights.Bold} color={Theme.colors.white}>
                      {cutleryCount} sets
                    </Typography>
                    <Icon from={IconLibraryName.Feather} name="edit-2" size={22} color={Theme.colors.white} />
                  </View>
                </TouchableOpacity>
              }
            />
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.footerRow}>
          <Typography color={Theme.colors.black}>Subtotal</Typography>
          <Typography color={Theme.colors.black}>{totalPrice.toFixed(2)} ETB</Typography>
        </View>
        
        {discount > 0 && (
          <View style={styles.footerRow}>
            <Typography color={Theme.colors.LightGreen}>Discount ({promoCode})</Typography>
            <Typography color={Theme.colors.LightGreen}>-{discount.toFixed(2)} ETB</Typography>
          </View>
        )}
        
        <View style={styles.footerRow}>
          <Typography color={Theme.colors.LightGreen}>Delivery Fee</Typography>
          <Typography color={Theme.colors.LightGreen}>{deliveryFee.toFixed(2)} ETB</Typography>
        </View>
        
        <View style={styles.footerRow}>
          <Typography style={styles.footerLabel}>Total</Typography>
          <Typography style={styles.footerTotal}>{finalTotal.toFixed(2)} ETB</Typography>
        </View>
        
        <Button 
          onPress={() => navigation.navigate(HomeScreens.ConfirmDelivery)} 
          text="Go to Checkout" 
          size={Size.Large} 
          style={{ borderRadius: 50 }} 
          icon 
        />
      </View>

      {/* Modals */}
      <CutleryModal
        visible={showCutleryModal}
        onClose={() => setShowCutleryModal(false)}
        currentCount={cutleryCount}
        onSave={handleCutlerySave}
      />

      <PromoCodeModal
        visible={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        onApply={handlePromoCodeApply}
      />

      <CustomModal
        visible={modalConfig.visible}
        onClose={hideModal}
        title={modalConfig.title}
        message={modalConfig.message}
        actions={modalConfig.actions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.GrayLight + '77',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  footerTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  cutleryCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.LightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cutleryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  modalSaveButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: Theme.colors.LightGreen,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: 'gray',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  promoHint: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default CartScreen;