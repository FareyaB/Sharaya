// screens/Cart.js
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

// Mock cart items (replace with your actual cart data)
const mockCartItems = [
  {
    id: '1',
    seller: 'Nameera by Farooq',
    caption: 'Bridal Lehenga',
    details: 'No Brand, Apparel Type: Lehenga, Color: Red',
    price: '$500',
    quantity: 1,
    deliveryOption: 'Standard Delivery',
    deliveryFee: '$10',
    deliveryDate: 'Guarantee by 25-30 Mar',
    image: 'https://via.placeholder.com/80',
    selected: true, // Add selected property
  },
  {
    id: '2',
    seller: 'Gulnaaz Khan Fashion',
    caption: 'Blue Anarkali',
    details: 'No Brand, Color Family: Blue, Size: S',
    price: '$300',
    quantity: 1,
    deliveryOption: 'Standard Delivery',
    deliveryFee: '$10',
    deliveryDate: 'Guarantee by 25-30 Mar',
    image: 'https://via.placeholder.com/80',
    selected: true, // Add selected property
  },
];

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState(mockCartItems);

  // Toggle selection of a cart item
  const toggleItemSelection = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Calculate total price for selected items only
  const calculateTotalPrice = () => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        const deliveryFee = parseFloat(item.deliveryFee.replace('$', ''));
        return total + price * item.quantity + deliveryFee;
      }, 0)
      .toFixed(2);
  };

  const totalPrice = `$${calculateTotalPrice()}`;
  const selectedItems = cartItems.filter(item => item.selected);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      {/* Checkbox for selection */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleItemSelection(item.id)}
      >
        <Ionicons
          name={item.selected ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.selected ? '#B577CD' : '#333'}
        />
      </TouchableOpacity>

      {/* Seller Name */}
      <Text style={styles.sellerName}>{item.seller}</Text>

      {/* Cart Item */}
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.cartImage} />
        <View style={styles.cartDetails}>
          <Text style={styles.cartCaption}>{item.caption}</Text>
          <Text style={styles.cartDetailsText}>{item.details}</Text>
          <Text style={styles.cartPrice}>{item.price}</Text>
          <Text style={styles.cartQuantity}>Qty: {item.quantity}</Text>
        </View>
      </View>

      {/* Delivery Option */}
      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryText}>
          {item.deliveryOption}, {item.deliveryFee}, {item.deliveryDate}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewOptionsText}>View all options</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout ({selectedItems.length})</Text>
        </View>
      </SafeAreaView>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty.</Text>}
      />

      {/* Total and Checkout Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalPrice}>{totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, { opacity: selectedItems.length === 0 ? 0.5 : 1 }]}
          onPress={() => {
            if (selectedItems.length === 0) {
              alert('Please select at least one item to checkout.');
              return;
            }
            navigation.navigate('Checkout', { cartItems: selectedItems, totalPrice });
          }}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.checkoutButtonText}>Checkout ({selectedItems.length})</Text>
        </TouchableOpacity>
      </View>

      <BottomNav navigation={navigation} activeRoute="Cart" />
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
    padding: 15, // Reduced paddingTop for better accessibility
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  cartList: {
    paddingBottom: 100,
  },
  cartItemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  checkboxContainer: {
    marginBottom: 10,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cartDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartCaption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartDetailsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cartPrice: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  cartQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  deliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
  },
  viewOptionsText: {
    fontSize: 14,
    color: '#B577CD',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 60, // Adjust for BottomNav height
    left: 0,
    right: 0,
  },
  totalContainer: {
    flexDirection: 'column',
  },
  totalText: {
    fontSize: 16,
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#B577CD', // Light purple color
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Cart;