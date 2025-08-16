import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import Button from '../../component/atom/button/button.component';
import SearchInput from '../../component/molecule/input/search-input';
import { Theme } from '../../theme/theme';
import { Intent, Shape, Size } from '../../../domain/enum/button';
import { useThemeContext } from '../../theme/theme-provider';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { HomeScreens } from '../../../domain/enum/screen-name';
import { useFoodStore } from '../../../application/stores/food.store';
import { IFood } from '../../types';
import { Grid3X3, List, Minus, Plus, ShoppingBag } from 'lucide-react-native';

const { width } = Dimensions.get('screen');
const GRID_ITEM_SIZE = (width - 48) / 2; // 2 columns with padding

type ViewMode = 'grid' | 'list';

const MenuGridScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors } = useThemeContext();
  const { foodItems, totalCartItems, addFoodToCart, removeFoodFromCart, cart, selectFood, loadFoodsFromApi } = useFoodStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(foodItems);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFoodsFromApiWithLoading();
  }, []);

  const loadFoodsFromApiWithLoading = async () => {
    setLoading(true);
    try {
      await loadFoodsFromApi();
    } catch (error) {
      // Handle loading error silently
    } finally {
      setLoading(false);
    }
  };

  // Update filtered foods when foodItems or searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFoods(foodItems);
    } else {
      const filtered = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(filtered);
    }
  }, [foodItems, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const getCartQuantity = (itemId: string): number => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const GridMenuItem = ({ item }: { item: IFood }) => {
    const cartQuantity = getCartQuantity(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: colors.card, shadowColor: '#8888' }]}
        onPress={() => {
          selectFood(item.id);
          navigation.navigate(HomeScreens.FoodSwiper);
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
        
        {/* Availability Badge */}
        {!item.availability && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Out of Stock</Text>
          </View>
        )}
        
        <View style={styles.gridContent}>
          <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.gridPrice, { color: colors.text }]}>
            {item.price.toFixed(2)} Birr
          </Text>
          <Text style={[styles.gridDelivery, { color: colors.muted }]}>
            {item.deliveryTime}
          </Text>
          
          {/* Add to Cart Controls */}
          <View style={styles.cartControls}>
            {cartQuantity > 0 ? (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => removeFoodFromCart(item.id)}
                  style={[styles.quantityButton, { backgroundColor: Theme.colors.Primary }]}
                >
                  <Minus size={16} color={Theme.colors.white} />
                </TouchableOpacity>
                
                <Text style={[styles.quantityText, { color: colors.text }]}>{cartQuantity}</Text>
                
                <TouchableOpacity
                  onPress={() => addFoodToCart(item.id)}
                  style={[styles.quantityButton, { backgroundColor: Theme.colors.Primary }]}
                  disabled={!item.availability || item.quantity <= 0}
                >
                  <Plus size={16} color={Theme.colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                onPress={() => addFoodToCart(item.id)}
                text="Add"
                intent={Intent.Primary}
                size={Size.Small}
                style={styles.addButton}
                disabled={!item.availability || item.quantity <= 0}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListMenuItem = ({ item }: { item: IFood }) => {
    const cartQuantity = getCartQuantity(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.listCard, { backgroundColor: colors.card, shadowColor: '#8888'}]}
        onPress={() => {
          selectFood(item.id);
          navigation.navigate(HomeScreens.FoodSwiper);
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
        
        <View style={styles.listContent}>
          <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.listDescription, { color: colors.muted }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.listMeta}>
            <Text style={[styles.listPrice, { color: colors.text }]}>
              {item.price.toFixed(2)} Birr
            </Text>
            <Text style={[styles.listDelivery, { color: colors.muted }]}>
              • {item.deliveryTime}
            </Text>
          </View>
          
          {!item.availability && (
            <Text style={[styles.listUnavailable, { color: Theme.colors.Error }]}>
              Out of Stock
            </Text>
          )}
        </View>
        
        <View style={styles.listCartControls}>
          {cartQuantity > 0 ? (
            <View style={styles.listQuantityControls}>
              <TouchableOpacity
                onPress={() => removeFoodFromCart(item.id)}
                style={[styles.quantityButton, { backgroundColor: Theme.colors.Primary }]}
              >
                <Minus size={16} color={Theme.colors.white} />
              </TouchableOpacity>
              
              <Text style={[styles.quantityText, { color: colors.text }]}>{cartQuantity}</Text>
              
              <TouchableOpacity
                onPress={() => addFoodToCart(item.id)}
                style={[styles.quantityButton, { backgroundColor: Theme.colors.Primary }]}
                disabled={!item.availability || item.quantity <= 0}
              >
                <Plus size={16} color={Theme.colors.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              onPress={() => addFoodToCart(item.id)}
              text="Add"
              intent={Intent.Primary}
              size={Size.Small}
              disabled={!item.availability || item.quantity <= 0}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridItem = ({ item }: { item: IFood }) => (
    <GridMenuItem item={item} />
  );

  const renderListItem = ({ item }: { item: IFood }) => (
    <ListMenuItem item={item} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon from={IconLibraryName.MaterialIcons} name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
        </View>
        
        <View style={styles.headerRight}>
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              style={[
                styles.toggleButton,
                viewMode === 'grid' && [styles.toggleButtonActive, { backgroundColor: Theme.colors.Primary }]
              ]}
            >
              <Grid3X3 
                size={18} 
                color={viewMode === 'grid' ? Theme.colors.white : colors.muted} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={[
                styles.toggleButton,
                viewMode === 'list' && [styles.toggleButtonActive, { backgroundColor: Theme.colors.Primary }]
              ]}
            >
              <List 
                size={18} 
                color={viewMode === 'list' ? Theme.colors.white : colors.muted} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Cart Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate(HomeScreens.Cart)}
            style={styles.cartButton}
          >
            <Icon from={IconLibraryName.Ionicons} name="fast-food" size={24} color={colors.text} />
            {totalCartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <SearchInput
        style={[styles.searchInput, { backgroundColor: colors.card, elevation: 20, shadowColor: '#8888', borderWidth:1, borderColor: '#8881' }]}
        placeholder="Search menu items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Menu Items */}
      {loading ? (
        <View style={styles.loadingState}>
          <Icon from={IconLibraryName.MaterialIcons} name="hourglass-empty" size={64} color={colors.muted} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>Loading menu items...</Text>
        </View>
      ) : filteredFoods.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            {searchQuery ? 'No items found' : 'No menu items available'}
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.muted }]}>
            {searchQuery ? 'Try adjusting your search terms' : 'Check back later or contact the restaurant'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when changing view mode
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Icon from={IconLibraryName.MaterialIcons} name="hourglass-empty" size={48} color={Theme.colors.white} />
            <Text style={styles.loadingOverlayText}>Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 7,
  },
  toggleButtonActive: {
    backgroundColor: Theme.colors.Primary,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Theme.colors.Error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: Theme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  // Grid Styles
  gridCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 15,
    shadowColor:'#8881',
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  gridContent: {
    padding: 14,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    minHeight: 36, // Ensure consistent height
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  gridDelivery: {
    fontSize: 11,
    marginBottom: 8,
  },
  // List Styles
  listCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    shadowColor:'#8881',
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  listDelivery: {
    fontSize: 11,
    marginLeft: 4,
  },
  listUnavailable: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  listCartControls: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  // Cart Controls
  cartControls: {
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 16,
  },
  // Badges
  unavailableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Theme.colors.Error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  unavailableText: {
    color: Theme.colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchInput: {
    margin: 10,
    marginTop: 15,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: Theme.colors.Primary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  loadingOverlayText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
});

export default MenuGridScreen;