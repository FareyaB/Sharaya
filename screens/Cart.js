import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav'; // Import BottomNav

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartItemsString = await AsyncStorage.getItem('cartItems');
        const items = cartItemsString ? JSON.parse(cartItemsString) : [];
        setCartItems(items);
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    };
    loadCartItems();
  }, []);

  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      alert('Item removed from cart.');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart. Please try again.');
    }
  };

  const updateQuantity = async (itemId, delta) => {
    try {
      const updatedCart = cartItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = (item.quantity || 1) + delta;
          if (newQuantity <= 0) return null;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return total + price * (item.quantity || 1);
    }, 0).toFixed(2);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.postImage }} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.cartCaption}>{item.caption}</Text>
        <Text style={styles.cartPrice}>{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 1}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  cartList: {
    paddingBottom: 150, // Adjusted to account for nav bar and total container
  },
  cartItem: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
  },
  cartImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  cartDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  cartCaption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartPrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#B577CD',
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#333',
    fontSize: 14,
  },
  totalContainer: {
    position: 'absolute',
    bottom: 60, // Adjusted to sit above the nav bar
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cart;