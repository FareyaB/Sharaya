// screens/CollectionDetails.js
import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';

const CollectionDetails = ({ navigation, route }) => {
  const { collection } = route.params;

  // Add an item to the cart
  const addToCart = async (item) => {
    try {
      const cartItemsString = await AsyncStorage.getItem('cartItems');
      let cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cartItems.push({ ...item, quantity: 1 });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      Alert.alert('Success', `${item.caption} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  // Remove an item from the collection
  const removeFromCollection = async (itemId) => {
    try {
      const collectionsString = await AsyncStorage.getItem('collections');
      let collections = collectionsString ? JSON.parse(collectionsString) : [];

      // Find the current collection and remove the item
      const updatedCollections = collections.map((col) => {
        if (col.name === collection.name) {
          return {
            ...col,
            items: col.items.filter((item) => item.id !== itemId),
          };
        }
        return col;
      });

      // Update AsyncStorage
      await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));

      // Update the route params to reflect the change
      navigation.setParams({
        collection: {
          ...collection,
          items: collection.items.filter((item) => item.id !== itemId),
        },
      });

      Alert.alert('Success', 'Item removed from collection.');
    } catch (error) {
      console.error('Error removing item from collection:', error);
      Alert.alert('Error', 'Failed to remove item from collection. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.postImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <CustomText weight="medium" style={styles.itemCaption}>{item.caption}</CustomText>
        <CustomText style={styles.itemPrice}>{item.price}</CustomText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <CustomText weight="bold" style={styles.addToCartText}>Add to Cart</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCollection(item.id)}
          >
            <CustomText style={styles.removeButtonText}>Remove</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText weight="semiBold" style={styles.headerTitle}>{collection.name}</CustomText>
      </View>

      {/* Collection Items */}
      <FlatList
        data={collection.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<CustomText style={styles.emptyText}>No items in this collection.</CustomText>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15, // Fixed duplicate padding property
    paddingTop: 55, // Increased for better spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    marginLeft: 20,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemCaption: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addToCartButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#333',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default CollectionDetails;