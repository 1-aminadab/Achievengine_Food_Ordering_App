import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
} from 'react-native';
import Icon, { IconLibraryName } from '../../component/atom/icon/icon.component';
import Button from '../../component/atom/button/button.component';
import { Theme } from '../../theme/theme';
import { Intent, Shape } from '../../../domain/enum/button';
import { useThemeContext } from '../../theme/theme-provider';
import { useNavigation } from '@react-navigation/native';
import { useFoodStore } from '../../../application/stores/food.store';
import { IFood } from '../../types';

interface MenuFormData {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  deliveryTime: string;
  quantity: string;
}

const MenuManagementScreen = () => {
  const navigation = useNavigation();
  const { colors } = useThemeContext();
  const { foodItems, addMenuItem, updateMenuItem, deleteMenuItem } = useFoodStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<IFood | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    deliveryTime: '',
    quantity: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      deliveryTime: '',
      quantity: '',
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
      deliveryTime: item.deliveryTime,
      quantity: item.quantity.toString(),
    });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem: IFood = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://via.placeholder.com/150',
      deliveryTime: formData.deliveryTime || '30 min',
      quantity: parseInt(formData.quantity) || 10,
      availability: true,
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, newItem);
      Alert.alert('Success', 'Menu item updated successfully');
    } else {
      addMenuItem(newItem);
      Alert.alert('Success', 'Menu item added successfully');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this menu item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMenuItem(itemId);
          },
        },
      ]
    );
  };

  const MenuItemCard = ({ item }: { item: IFood }) => (
    <View style={[styles.menuItemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>${item.price}</Text>
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
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Menu Management</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
          <Icon from={IconLibraryName.MaterialIcons} name="add" size={24} color={Theme.colors.Primary} />
        </TouchableOpacity>
      </View>

      {/* Menu Items List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {foodItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon from={IconLibraryName.MaterialIcons} name="restaurant-menu" size={64} color={colors.muted} />
            <Text style={[styles.emptyText, { color: colors.muted }]}>No menu items yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.muted }]}>Add your first menu item to get started</Text>
          </View>
        ) : (
          foodItems.map((item) => <MenuItemCard key={item.id} item={item} />)
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

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Image URL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={formData.imageUrl}
                onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                placeholder="Enter image URL"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Delivery Time</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                  value={formData.deliveryTime}
                  onChangeText={(text) => setFormData({ ...formData, deliveryTime: text })}
                  placeholder="e.g., 30 min"
                  placeholderTextColor={colors.muted}
                />
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
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
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
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
});

export default MenuManagementScreen;