import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality} from 'react-native-image-picker';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import Button from '../../component/atom/button/button.component';
import { Theme } from '../../theme/theme';
import { Intent, Shape } from '../../../domain/enum/button';
import { useThemeContext } from '../../theme/theme-provider';
import { useNavigation } from '@react-navigation/native';
import { useFoodStore } from '../../../application/stores/food.store';
import { IFood } from '../../types';
import CustomModal from '../../component/molecule/modal/custom-modal.component';
import SearchInput from '../../component/molecule/input/search-input';
import { api } from '../../../api';

interface MenuFormData {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  imageUri: string | null;
  deliveryTime: string;
  quantity: string;
  userDistance?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const MenuManagementScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const { foodItems, addMenuItem, updateMenuItem, deleteMenuItem, loadFoodsFromApi } = useFoodStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IFood | null>(null);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    imageUri: null,
    deliveryTime: '',
    quantity: '',
  });
  const [modalConfig, setModalConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    actions: Array<{text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive'}>;
  }>({
    visible: false,
    title: '',
    message: '',
    actions: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(foodItems);

  const showModal = (title: string, message: string, actions: Array<{text: string; onPress: () => void; style?: 'default' | 'cancel' | 'destructive'}> = []) => {
    setModalConfig({
      visible: true,
      title,
      message,
      actions: actions.length > 0 ? actions : [{ text: 'OK', onPress: () => hideModal(), style: 'default' }]
    });
  };

  const hideModal = () => {
    setModalConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    loadFoodsFromApi();
    requestPermissions();
    verifyBackendConnection();
  }, []);

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

  const verifyBackendConnection = async () => {
    try {
      console.log('🔍 Verifying backend connection on screen load...');
      const isConnected = await api.food.getAllFoods().then(() => true).catch(() => false);
      setBackendConnected(isConnected);
      if (isConnected) {
        console.log('✅ Backend connection verified - ready for menu management');
      } else {
        console.log('⚠️ Backend connection failed - some features may not work');
      }
    } catch (error) {
      console.error('❌ Backend connection verification failed:', error);
      setBackendConnected(false);
    }
  };

  const requestPermissions = () => {
    // Permissions are handled automatically by react-native-image-picker
    // No need for explicit permission requests
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8 as PhotoQuality,
      selectionLimit: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('Image picker response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      
      if (response.errorMessage) {
        console.error('Image picker error:', response.errorMessage);
        showModal('Error', `Failed to pick image: ${response.errorMessage}`);
        return;
      }

      if (response.errorCode) {
        console.error('Image picker error code:', response.errorCode);
        showModal('Error', `Image picker error: ${response.errorCode}`);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        console.log('Selected image asset:', asset);
        
        if (!asset.uri) {
          showModal('Error', 'Selected image has no URI');
          return;
        }
        
        setFormData(prev => ({
          ...prev,
          imageUri: asset.uri || null,
          imageUrl: '', // Clear URL when local image is selected
        }));
      } else {
        showModal('Error', 'No image selected');
      }
    });
  };

  const calculateDeliveryTime = (distance?: string) => {
    if (!distance || distance === '') return '30-45 min';
    
    const distanceKm = parseFloat(distance);
    if (isNaN(distanceKm)) return '30-45 min';
    
    // Calculate delivery time based on distance
    // Base time: 20 minutes + 5 minutes per km
    const baseTime = 20;
    const timePerKm = 5;
    const totalTime = baseTime + (distanceKm * timePerKm);
    
    const minTime = Math.max(15, totalTime - 5);
    const maxTime = totalTime + 10;
    
    return `${Math.round(minTime)}-${Math.round(maxTime)} min`;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      imageUri: null,
      deliveryTime: '',
      quantity: '',
      userDistance: '',
    });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item: IFood) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      imageUrl: item.imageUrl,
      imageUri: null,
      deliveryTime: item.deliveryTime,
      quantity: item.quantity.toString(),
      userDistance: '',
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.description) {
      showModal('Error', 'Please fill in all required fields');
      return;
    }

    // Only require image for new items, not for updates
    if (!editingItem && !formData.imageUri) {
      showModal('Error', 'Please select an image from your device');
      return;
    }

    setLoading(true);
    try {
      // Verify backend connection before proceeding
      console.log('🔍 Verifying backend connection before upload...');
      const isConnected = await api.food.getAllFoods().then(() => true).catch(() => false);
      if (!isConnected) {
        showModal('Error', 'Cannot connect to backend server. Please check your connection and try again.');
        setLoading(false);
        return;
      }

      let imageUrl = formData.imageUrl || '';

      // Upload the selected image only if a new image is selected
      if (formData.imageUri) {
        try {
          console.log('Starting image upload for menu item:', formData.name);
          const fileName = `menu_${Date.now()}_${formData.name.replace(/\s+/g, '_')}.jpg`;
          const uploadResponse = await api.upload.uploadImage(formData.imageUri, fileName);
          imageUrl = uploadResponse.data.url || uploadResponse.data.imageUrl;
          console.log('Image upload successful:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          showModal('Error', `Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}. Please try again.`);
          setLoading(false);
          return;
        }
      }

      // Calculate delivery time based on distance if provided
      const calculatedDeliveryTime = formData.userDistance 
        ? calculateDeliveryTime(formData.userDistance)
        : formData.deliveryTime || '30-45 min';

      const quantity = parseInt(formData.quantity) || 0;
      const foodData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        description: formData.description,
        imageUrl: imageUrl || 'https://via.placeholder.com/150',
        deliveryTime: calculatedDeliveryTime,
        quantity: quantity,
        availability: quantity > 0, // Set availability based on quantity
        category: 'main',
        restaurant: 'Default Restaurant',
        userDistance: formData.userDistance ? parseFloat(formData.userDistance) : undefined,
      };

      console.log('Saving food data:', foodData);

      if (editingItem) {
        await api.food.updateFood(editingItem.id, foodData);
        showModal('Success', 'Menu item updated successfully');
      } else {
        await api.food.createFood(foodData);
        showModal('Success', 'Menu item added successfully');
      }

      // Refresh the food list
      await loadFoodsFromApi();
      setShowAddModal(false);
      resetForm();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      showModal('Error', `Failed to save menu item: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (itemId: string) => {
    showModal(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', onPress: () => hideModal(), style: 'cancel' as const },
        {
          text: 'Delete',
          style: 'destructive' as const,
          onPress: async () => {
            hideModal();
            setLoading(true);
            try {
              await api.food.deleteFood(itemId);
              await loadFoodsFromApi();
              showModal('Success', 'Menu item deleted successfully');
            } catch (error) {
              console.error('Error deleting menu item:', error);
              showModal('Error', 'Failed to delete menu item. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const testUploadEndpoint = async () => {
    try {
      setLoading(true);
      const result = await api.upload.testUploadEndpoint();
      showModal('Upload Test', `Upload endpoint is working!\n\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Upload test failed:', error);
      showModal('Upload Test Failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      setLoading(true);
      const isConnected = await api.food.getAllFoods().then(() => true).catch(() => false);
      setBackendConnected(isConnected);
      if (isConnected) {
        showModal('Connection Test', '✅ Backend connection is working!\n\nServer is responding correctly.');
      } else {
        showModal('Connection Test', '❌ Backend connection failed!\n\nPlease check if the server is running.');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setBackendConnected(false);
      showModal('Connection Test Failed', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const MenuItemCard = ({ item }: { item: IFood }) => (
    <View style={[styles.menuItemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>{item.price} ETB</Text>
        <Text style={[styles.itemDescription, { color: colors.muted }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.itemStock, { color: colors.muted }]}>
          Stock: {item.quantity} • {item.deliveryTime}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Theme.colors.Primary }]}
          onPress={() => openEditModal(item)}
        >
          <Icon from={IconLibraryName.MaterialIcons} name="edit" size={16} color={Theme.colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Theme.colors.Error }]}
          onPress={() => handleDelete(item.id)}
        >
          <Icon from={IconLibraryName.MaterialIcons} name="delete" size={16} color={Theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon from={IconLibraryName.MaterialIcons} name="arrow-back" size={24} color={colors.text} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Menu Management</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          
          
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Icon from={IconLibraryName.MaterialIcons} name="add" size={24} color={Theme.colors.Primary} />
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

      {/* Menu Items List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredFoods.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon from={IconLibraryName.MaterialIcons} name="restaurant-menu" size={64} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {searchQuery ? 'No items found' : 'No menu items yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>
              {searchQuery ? 'Try adjusting your search terms' : 'Add your first menu item to get started'}
            </Text>
          </View>
        ) : (
          filteredFoods.map((item) => <MenuItemCard key={item.id} item={item} />)
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Icon from={IconLibraryName.MaterialIcons} name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveButton, { color: Theme.colors.Primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter food name"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="Enter price"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter description"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Image Upload Section */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Image {!editingItem ? '*' : '(optional)'}
              </Text>
              
              {/* Image Preview */}
              {(formData.imageUri || formData.imageUrl) && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: formData.imageUri || formData.imageUrl }} 
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setFormData(prev => ({ ...prev, imageUri: null, imageUrl: '' }))}
                  >
                    <Icon from={IconLibraryName.MaterialIcons} name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Upload Button */}
              <TouchableOpacity 
                style={[styles.uploadButton, { borderColor: colors.border }]}
                onPress={pickImage}
              >
                <Icon from={IconLibraryName.MaterialIcons} name="cloud-upload" size={24} color={colors.text} />
                <Text style={[styles.uploadButtonText, { color: colors.text }]}>
                  {(formData.imageUri || formData.imageUrl) ? 'Change Image' : 'Upload Image'}
                </Text>
              </TouchableOpacity>
              
            </View>

            {/* Distance and Delivery Time Calculation */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>User Distance (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={formData.userDistance}
                onChangeText={(text) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    userDistance: text,
                    deliveryTime: text ? calculateDeliveryTime(text) : prev.deliveryTime
                  }));
                }}
                placeholder="Enter distance in km (e.g., 5.2)"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
              />
              {formData.userDistance && (
                <Text style={[styles.calculatedTime, { color: colors.primary }]}>
                  Calculated delivery time: {calculateDeliveryTime(formData.userDistance)}
                </Text>
              )}
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Delivery Time</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  value={formData.deliveryTime}
                  onChangeText={(text) => setFormData({ ...formData, deliveryTime: text })}
                  placeholder="e.g., 30-45 min"
                  placeholderTextColor={colors.muted}
                />
                <Text style={[styles.helpText, { color: colors.muted }]}>
                  Auto-calculated if distance is provided
                </Text>
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Stock Quantity</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                  placeholder="Stock qty"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

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
  backButton: {
    flexDirection: 'row',
    gap: 10,
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  testButton: {
    padding: 8,
  },
  connectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  menuItemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 0,
    shadowColor: '#8888',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  itemStock: {
    fontSize: 11,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 12,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 12,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  orText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  calculatedTime: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  searchInput: {
    margin: 10,
  },
});

export default MenuManagementScreen;