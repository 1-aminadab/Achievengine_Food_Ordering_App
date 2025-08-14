/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View, Animated, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../component/atom/button/button.component';
import Typography from '../../component/atom/typography/text.component';
import { Shape } from '../../../domain/enum/button';
import { Theme } from '../../theme/theme';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import { Colors, FontSizes, FontWeights } from '../../../domain/enum/theme';
import { dummyFoods } from '../../../application/data/dummy-data';
import { useFoodStore } from '../../../application/stores/food.store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeScreens } from '../../../domain/enum/screen-name';
import IconButton from '../../component/atom/button/icon-button.component';
import { commonStyles } from '../../styles/common-styles';

export default function FoodSwiperScreen() {
  const { cart, totalCartItems, foodItems, selectedFood, selectFood, addFoodToCart, removeFoodFromCart } = useFoodStore();

  const [viewHeight, setHeight] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = React.useRef<FlatList>(null);
  const dispatch = { addFoodToCart, selectFood } as const;
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSelectFood = (id: string) => {
    dispatch.selectFood(id);
    navigation.navigate(HomeScreens.FoodDetail);
  };
  useEffect(() => {
    // If a specific food is selected, find its index and scroll to it
    if (selectedFood && foodItems && foodItems.length > 0 && viewHeight) {
      const selectedIndex = foodItems.findIndex(item => item.id === selectedFood.id);
      if (selectedIndex !== -1 && selectedIndex < foodItems.length) {
        setCurrentIndex(selectedIndex);
        // Scroll to the selected item after a small delay to ensure FlatList is ready
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: false,
          });
        }, 100);
      }
    }
  }, [selectedFood, foodItems, viewHeight]);

  const getCartQuantity = (itemId: string): number => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  return (
    <View style={styles.container} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          icon={<Icon from={IconLibraryName.Ionicons} name="arrow-back" size={20} color="white" />}
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          shape={Shape.Circle}
        />
        <Typography size={FontSizes.Medium} weight={FontWeights.Bold} color={Theme.colors.white} style={styles.headerText}>
          Top Picks for Lunch
        </Typography>
        <View style={{ position: "relative" }}>
          {
            totalCartItems > 0 &&
            <View style={{ zIndex: 1, position: "absolute", left: "72%", top: "-10%", height: 15, width: 15, borderRadius: 10, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
              <Typography size={FontSizes.ExtraSmall} style={{ fontSize: 7 }}>
                {
                  totalCartItems
                }
              </Typography>

            </View>
          }

          <IconButton
            onPress={() => totalCartItems > 0 && navigation.navigate(HomeScreens.Cart)}
            icon={<Icon from={IconLibraryName.Ionicons} name="fast-food" size={24} color={Theme.colors.Primary} />}
          />
        </View>

      </View>
      {viewHeight && foodItems && foodItems.length > 0 && (
        <Animated.FlatList
          ref={flatListRef}
          data={foodItems}
          pagingEnabled
          keyExtractor={(item, index) => `${item.id}-${index}`}
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: viewHeight,
            offset: viewHeight * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            const cartQuantity = getCartQuantity(item.id);
            return (
            <View style={[styles.item, { height: viewHeight }]}>
              <ImageBackground style={styles.img} source={{ uri: item.imageUrl }} resizeMode="cover" blurRadius={12}>
                {/* Gradient Overlay */}
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                  {(() => {
                    const inputRange = [
                      (index - 1) * viewHeight,
                      index * viewHeight,
                      (index + 1) * viewHeight,
                    ];
                    const rotate = scrollY.interpolate({
                      inputRange,
                      // Rotate a full 365 degrees across one screen height in either direction
                      outputRange: ['-365deg', '0deg', '365deg'],
                      extrapolate: 'clamp',
                    });
                    const scale = scrollY.interpolate({
                      inputRange,
                      // Scale up as we leave center in either direction
                      outputRange: [1.2, 1.0, 1.2],
                      extrapolate: 'clamp',
                    });
                    const opacity = scrollY.interpolate({
                      inputRange,
                      // Slightly dim when away from center
                      outputRange: [0.7, 1.0, 0.7],
                      extrapolate: 'clamp',
                    });
                    return (
                      <Animated.Image
                        source={{ uri: item.imageUrl }}
                        style={{ width: 300, height: 300, borderRadius: 100, opacity, transform: [{ rotate }, { scale }] }}
                      />
                    );
                  })()}
                </View>
                
                <LinearGradient
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0, y: 1 }}
                  colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.5)']}
                  style={styles.gradient}
                />
                {/* Bottom Card */}
                <View style={styles.card}>
                  {/* Restaurant Info */}
                  <View style={styles.restaurantInfo}>
                    <Image
                      source={{
                        uri: item.imageUrl,
                      }}
                      style={styles.profileImage}
                    />
                    <View style={styles.textContainer}>
                      <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Theme.colors.white} >
                        {'Shanghai Me >'}
                      </Typography>
                      <Typography size={FontSizes.ExtraSmall}
                        weight={FontWeights.Bold}
                        color={Theme.colors.white} >
                        {item.deliveryTime}
                      </Typography>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleSelectFood(item.id)} style={{ backgroundColor: Theme.colors.GrayDark + 'ee', flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Typography numberOfLines={1} size={FontSizes.Medium} weight={FontWeights.Bold} color={Theme.colors.white} >
                        {item.name}
                      </Typography>
                      <Typography size={FontSizes.Small} weight={FontWeights.Bold} color={Colors.white} >
                        {item.price.toFixed(2)} Birr
                      </Typography>
                      {!item.availability && (
                        <Typography size={FontSizes.ExtraSmall} weight={FontWeights.Bold} color={Theme.colors.Error} >
                          Out of Stock
                        </Typography>
                      )}
                      <Typography numberOfLines={2} size={FontSizes.Small} color={Theme.colors.GrayLight} >
                        {item.description}
                      </Typography>

                    </View>
                    <View style={styles.rightSection}>
                      <Image
                        source={{
                          uri: item.imageUrl,
                        }}
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: 15,
                        }}
                      />
                      {/* Cart Controls */}
                      {cartQuantity > 0 ? (
                        <View style={styles.cartControlsSwiper}>
                          <TouchableOpacity
                            onPress={() => removeFoodFromCart(item.id)}
                            style={[styles.cartButtonSwiper, styles.minusButton]}
                          >
                            <Icon from={IconLibraryName.Ionicons} name="remove" size={16} color={Theme.colors.white} />
                          </TouchableOpacity>
                          
                          <Text style={styles.quantityTextSwiper}>{cartQuantity}</Text>
                          
                          <TouchableOpacity
                            onPress={() => addFoodToCart(item.id)}
                            style={[styles.cartButtonSwiper, styles.plusButton]}
                            disabled={!item.availability || item.quantity <= 0}
                          >
                            <Icon from={IconLibraryName.Ionicons} name="add" size={16} color={Theme.colors.white} />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Button
                          icon={<Icon from={IconLibraryName.Ionicons} name="add" size={24} color={Theme.colors.black} />}
                          style={[styles.addButton, !item.availability && styles.disabledButton]}
                          onPress={() => { addFoodToCart(item.id!) }}
                          disabled={!item.availability || item.quantity <= 0}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                  
                </View>
              </ImageBackground>
            </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
  },
  img: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 30,
    zIndex: 10,
    // backgroundColor:"red"
  },
  iconButton: {
    backgroundColor: Theme.colors.GrayDark,
    height: 47,
    width: 47,
    // padding: 10,
  },
  shareButton: {
    backgroundColor: Theme.colors.white + '99',
    height: 47,
    width: 47,
    // padding: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    // marginHorizontal: 5,
    marginBottom: 30,
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 20,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 35,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  restaurantName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'gray',
    fontSize: 14,
  },
  foodTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  foodDescription: {
    color: 'gray',
    fontSize: 14,
    marginBottom: 10,
  },
  price: {
    color: '#90EE90',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Theme.colors.white,
    width: 35,
    height: 35,
    borderRadius: 25,
    ...commonStyles.centered,
    alignSelf: 'flex-end',
    position: 'absolute',
    top: '35%',
    left: '50%',
  },
  disabledButton: {
    backgroundColor: Theme.colors.GrayLight,
    opacity: 0.5,
  },
  rightSection: {
    position: 'relative',
    alignItems: 'center',
  },
  cartControlsSwiper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '35%',
    left: '20%',
    backgroundColor: Theme.colors.white + 'dd',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartButtonSwiper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButton: {
    backgroundColor: Theme.colors.Error,
  },
  plusButton: {
    backgroundColor: Theme.colors.Primary,
  },
  quantityTextSwiper: {
    color: Theme.colors.black,
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
});

