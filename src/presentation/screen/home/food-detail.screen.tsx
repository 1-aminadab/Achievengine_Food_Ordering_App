import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
  Switch,
  Animated,
  Dimensions,
} from 'react-native';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Theme } from '../../theme/theme';
import { FontSizes, FontWeights } from '../../../domain/enum/theme';
import { NavComponent } from '../../component/molecule/card/nav-card.component';
import { useFoodStore } from '../../../application/stores/food.store';
import IconButton from '../../component/atom/button/icon-button.component';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../theme/theme-provider';
import { dummyFooter } from '../../../application/data/dummy-data';
import Typography from '../../component/atom/typography/text.component';
import Button from '../../component/atom/button/button.component';
import { Size } from '../../../domain/enum/button';
import { HomeScreens } from '../../../domain/enum/screen-name';
import CustomModal from '../../component/molecule/modal/custom-modal.component';

const PromoFoodCard = ({ title, image, tag, onPress }: { 
  title: string; 
  image: string; 
  tag: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.promoCard}>
    {tag && (
      <View style={styles.promoTag}>
        <Text style={styles.promoTagText}>{tag}</Text>
      </View>
    )}
    <Image source={{ uri: image }} style={styles.foodImage} />
    <Text style={styles.promoCardTitle}>{title}</Text>
  </TouchableOpacity>
);

enum ButtonType {
  Delivery = 'Delivery',
  Takeaway = 'Takeaway'
}

// Customization Modal
const CustomizationModal = ({ visible, onClose, onSave }: {
  visible: boolean;
  onClose: () => void;
  onSave: (customizations: any) => void;
}) => {
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [noOnions, setNoOnions] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');
  const { colors } = useThemeContext();

  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Very Hot'];

  const handleSave = () => {
    const customizations = {
      spiceLevel,
      extraCheese,
      extraSauce,
      noOnions,
      specialRequest,
    };
    onSave(customizations);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={styles.modalTitle}>Customize Your Order</Text>
          
          <ScrollView style={{ maxHeight: 400 }}>
            {/* Spice Level */}
            <View style={styles.customizationSection}>
              <Text style={styles.sectionTitle}>Spice Level</Text>
              <View style={styles.spiceLevelContainer}>
                {spiceLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setSpiceLevel(level)}
                    style={[
                      styles.spiceLevelButton,
                      spiceLevel === level && styles.spiceLevelButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.spiceLevelText,
                      spiceLevel === level && styles.spiceLevelTextActive
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Add-ons */}
            <View style={styles.customizationSection}>
              <Text style={styles.sectionTitle}>Add-ons</Text>
              
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Extra Cheese (+25 ETB)</Text>
                <Switch
                  value={extraCheese}
                  onValueChange={setExtraCheese}
                  trackColor={{ false: '#ddd', true: Theme.colors.LightGreen }}
                />
              </View>
              
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Extra Sauce (+15 ETB)</Text>
                <Switch
                  value={extraSauce}
                  onValueChange={setExtraSauce}
                  trackColor={{ false: '#ddd', true: Theme.colors.LightGreen }}
                />
              </View>
              
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>No Onions</Text>
                <Switch
                  value={noOnions}
                  onValueChange={setNoOnions}
                  trackColor={{ false: '#ddd', true: Theme.colors.LightGreen }}
                />
              </View>
            </View>

            {/* Special Request */}
            <View style={styles.customizationSection}>
              <Text style={styles.sectionTitle}>Special Request</Text>
              <TextInput
                style={[styles.textInput, { borderColor: colors.border, color: colors.text }]}
                placeholder="Any special instructions..."
                placeholderTextColor={colors.text + '80'}
                value={specialRequest}
                onChangeText={setSpecialRequest}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.modalSaveButton}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FoodDetailScreen = () => {
  const selectedFood = useFoodStore((s) => s.selectedFood);
  const { addFoodToCart, selectFood } = useFoodStore();
  const navigation = useNavigation();
  const [currentButton, setCurrentButton] = useState(ButtonType.Delivery);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizations, setCustomizations] = useState<any>({});
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

  const { colors } = useThemeContext();

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideInAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const { height: screenHeight } = Dimensions.get('window');
  const HEADER_HEIGHT = screenHeight * 0.4;

  useEffect(() => {
    // Initial entrance animations
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Parallax transform for header image
  const headerTransform = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT * 0.5],
    extrapolate: 'clamp',
  });

  // Scale effect for header image
  const headerScale = scrollY.interpolate({
    inputRange: [-200, 0, HEADER_HEIGHT],
    outputRange: [1.3, 1, 0.9],
    extrapolate: 'clamp',
  });

  // Opacity for header overlay
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
    outputRange: [0.3, 0.5, 0.8],
    extrapolate: 'clamp',
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

  const handleAddToCart = () => {
    if (!selectedFood) return;
    
    for (let i = 0; i < quantity; i++) {
      addFoodToCart(selectedFood.id);
    }
    
    showModal(
      'Added to Cart!',
      `${quantity} x ${selectedFood.name} added to your cart`,
      [
        { text: 'Continue', onPress: () => hideModal() },
        { 
          text: 'View Cart', 
          onPress: () => {
            hideModal();
            navigation.navigate(HomeScreens.Cart);
          }
        }
      ]
    );
  };

  const handleCustomizationSave = (newCustomizations: any) => {
    setCustomizations(newCustomizations);
    showModal('Customization Saved', 'Your preferences have been saved!');
  };

  const calculatePrice = () => {
    if (!selectedFood) return 0;
    let price = selectedFood.price * quantity;
    if (customizations.extraCheese) price += 25 * quantity;
    if (customizations.extraSauce) price += 15 * quantity;
    return price;
  };

  const handleShare = () => {
    showModal(
      'Share Food',
      `Share ${selectedFood?.name} with friends!`,
      [
        { text: 'Copy Link', onPress: () => { hideModal(); showModal('Success', 'Link copied!'); } },
        { text: 'Share via WhatsApp', onPress: () => { hideModal(); showModal('Info', 'Opening WhatsApp...'); } },
        { text: 'Cancel', onPress: () => hideModal(), style: 'cancel' }
      ]
    );
  };

  const handleScheduleOrder = () => {
    showModal(
      'Schedule Order',
      'When would you like to receive this order?',
      [
        { text: 'ASAP', onPress: () => { hideModal(); showModal('Order Scheduled', 'Order scheduled for ASAP'); } },
        { text: 'In 1 hour', onPress: () => { hideModal(); showModal('Order Scheduled', 'Order scheduled for 1 hour'); } },
        { text: 'Choose time', onPress: () => { hideModal(); showModal('Info', 'Time picker would open here'); } },
        { text: 'Cancel', onPress: () => hideModal(), style: 'cancel' }
      ]
    );
  };

  const handleRatingPress = () => {
    showModal(
      'Customer Reviews',
      `★★★★☆ 4.5/5\n\n"Amazing food! Great taste and quality." - John D.\n\n"Fast delivery and hot food." - Sarah M.\n\n"Best pizza in town!" - Mike K.`,
      [{ text: 'Close', onPress: () => hideModal() }]
    );
  };

  if (!selectedFood) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No food item selected</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Back Button */}
      <View style={styles.headerButtons}>
        <IconButton
          onPress={() => navigation.goBack()}
          icon={<Icon from={IconLibraryName.MaterialIcons} name="arrow-back-ios" size={20} color={Theme.colors.white} />}
          style={styles.headerButton}
        />
        <View style={styles.rightButtons}>
          <IconButton
            onPress={handleShare}
            icon={<Icon from={IconLibraryName.MaterialIcons} name="share" size={24} color={Theme.colors.white} />}
            style={styles.headerButton}
          />
          <IconButton
            onPress={() => {
              setIsFavorite(!isFavorite);
              animateFavorite();
            }}
            icon={
              <Icon 
                from={IconLibraryName.MaterialIcons} 
                name={isFavorite ? "favorite" : "favorite-border"} 
                size={24} 
                color={isFavorite ? Theme.colors.red : Theme.colors.white} 
              />
            }
            style={styles.headerButton}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollableContent}
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <View style={styles.imageSection}>
          <ImageBackground
            source={{ uri: selectedFood.imageUrl }}
            style={styles.headerImageContainer}
            blurRadius={13}
          >
            <View style={styles.imageOverlay}>
              <View style={{ position:'relative', height:'270%', alignItems:'center', justifyContent:'center'}}>
                <Animated.Image 
                  source={{uri: selectedFood.imageUrl}} 
                  style={[
                    {zIndex:1, position:'absolute', top:-10, left:0, borderRadius: 100, width: 400, height: 400},
                    {
                      transform: [{ scale: scaleAnim }],
                      opacity: fadeInAnim
                    }
                  ]} 
                />
              </View>
            </View>
            
            <Animated.View style={[
              styles.discountTag,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideInAnim }]
              }
            ]}>
              <Text style={styles.discountTagText}>30% Off</Text>
            </Animated.View>
          </ImageBackground>
        </View>

        {/* Food Details */}
        <Animated.View style={[
          styles.detailsContainer, 
          { backgroundColor: colors.card },
          {
            opacity: fadeInAnim,
            transform: [{ translateY: slideInAnim }]
          }
        ]}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Typography size={FontSizes.ExtraLarge} weight={FontWeights.Bold} color={Theme.colors.black}>
                {selectedFood.name}
              </Typography>
              <Typography size={FontSizes.Medium} color={Theme.colors.gray}>
                {selectedFood.description}
              </Typography>
            </View>
            <Typography size={FontSizes.Large} weight={FontWeights.Bold} color={Theme.colors.LightGreen}>
              {calculatePrice().toFixed(2)} ETB
            </Typography>
          </View>

          <TouchableOpacity onPress={handleRatingPress}>
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Icon from={IconLibraryName.MaterialIcons} name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>4.5 (62 reviews)</Text>
                <Icon from={IconLibraryName.Feather} name="chevron-right" size={16} color={Theme.colors.gray} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Delivery/Takeaway Toggle */}
          <Animated.View style={[
            styles.deliveryToggle,
            {
              opacity: fadeInAnim,
              transform: [{ translateY: slideInAnim }]
            }
          ]}>
            <TouchableOpacity 
              onPress={() => setCurrentButton(ButtonType.Delivery)} 
              style={[currentButton === ButtonType.Delivery ? styles.toggleButtonActive : styles.toggleButton]}
            >
              <Text style={[styles.toggleButtonText, {color: currentButton === ButtonType.Delivery ? Theme.colors.white : Theme.colors.black}]}>
                Delivery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setCurrentButton(ButtonType.Takeaway)} 
              style={[currentButton === ButtonType.Takeaway ? styles.toggleButtonActive : styles.toggleButton]}
            >
              <Text style={[styles.toggleButtonText, {color: currentButton === ButtonType.Takeaway ? Theme.colors.white : Theme.colors.black}]}>
                Takeaway
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Interactive Options */}
          <NavComponent
            icon={<Icon from={IconLibraryName.MaterialIcons} name="location-pin" size={22} color={Theme.colors.black} />}
            title="Deliver to"
            description="Bole, Addis Ababa, Ethiopia"
            onPress={() => showModal('Change Address', 'Address selection would open here')}
          />
          
          <TouchableOpacity onPress={handleScheduleOrder}>
            <NavComponent
              icon={<Icon from={IconLibraryName.MaterialIcons} name="timer" size={20} color={Theme.colors.black} />}
              title="Ready in 28 min"
              description="Tap to schedule order"
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setShowCustomization(true)}>
            <NavComponent
              icon={<Icon from={IconLibraryName.MaterialIcons} name="tune" size={20} color={Theme.colors.black} />}
              title="Customize"
              description="Add special instructions, spice level, etc."
              navItem={
                <Icon from={IconLibraryName.Feather} name="chevron-right" size={20} color={Theme.colors.gray} />
              }
            />
          </TouchableOpacity>

          {/* Quantity Selector */}
          <Animated.View style={[
            styles.quantitySection,
            {
              opacity: fadeInAnim,
              transform: [{ translateY: slideInAnim }]
            }
          ]}>
            <Typography size={FontSizes.Large} weight={FontWeights.Bold}>Quantity</Typography>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                onPress={() => {
                  setQuantity(Math.max(1, quantity - 1));
                  animateQuantityChange();
                }}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </Animated.View>
              <TouchableOpacity 
                onPress={() => {
                  setQuantity(quantity + 1);
                  animateQuantityChange();
                }}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Add to Cart Button */}
          <Animated.View style={{
            transform: [
              { 
                scale: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95]
                })
              }
            ],
            opacity: fadeInAnim
          }}>
            <Button
              onPress={handleAddToCart}
              text={`Add ${quantity} to Cart - ${calculatePrice().toFixed(2)} ETB`}
              size={Size.Large}
              style={styles.addToCartButton}
            />
          </Animated.View>
        </Animated.View>

        {/* Related Items */}
        <Animated.View style={[
          styles.relatedSection,
          {
            opacity: fadeInAnim,
            transform: [{ translateY: slideInAnim }]
          }
        ]}>
          <Typography size={FontSizes.Large} weight={FontWeights.Bold} style={styles.sectionTitle}>
            You might also like
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dummyFooter.map((dummy, index) => (
              <Animated.View
                key={index}
                style={{
                  opacity: fadeInAnim,
                  transform: [{
                    translateY: slideInAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 50 + (index * 10)],
                      extrapolate: 'clamp'
                    })
                  }]
                }}
              >
                <PromoFoodCard
                  title={dummy.title}
                  image={selectedFood.imageUrl}
                  tag={dummy.promo}
                  onPress={() => {
                    // In a real app, you'd select a different food item
                    showModal('Item Selected', `${dummy.title} selected!`);
                  }}
                />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>

      <CustomizationModal
        visible={showCustomization}
        onClose={() => setShowCustomization(false)}
        onSave={handleCustomizationSave}
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
    backgroundColor: '#fff',
  },

  scrollableContent: {
    flex: 1,
  },
  imageSection: {
    height: Dimensions.get('window').height * 0.5, // 50% of screen height
  },
  headerImageContainer: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  discountTag: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#FF5733',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 2000
  },
  discountTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: Theme.colors.white,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    marginTop: 0,
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ratingRow: {
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.GrayLight,
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
    marginRight: 5,
  },
  deliveryToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 25,
  },
  toggleButtonActive: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  toggleButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.GrayLight,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.GrayLight,
    borderRadius: 25,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.LightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  addToCartButton: {
    borderRadius: 25,
    marginTop: 10,
  },
  relatedSection: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  promoCard: {
    marginRight: 15,
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    paddingBottom: 15,
    alignItems: 'center',
  },
  promoTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF5733',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  promoTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  foodImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    resizeMode: 'cover',
  },
  promoCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 8,
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  customizationSection: {
    marginBottom: 20,
  },
  spiceLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  spiceLevelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  spiceLevelButtonActive: {
    backgroundColor: Theme.colors.LightGreen,
    borderColor: Theme.colors.LightGreen,
  },
  spiceLevelText: {
    color: '#333',
    fontSize: 14,
  },
  spiceLevelTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
});

export default FoodDetailScreen;