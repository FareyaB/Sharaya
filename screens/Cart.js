// screens/Cart.js
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

// Mock cart items with actual images
const mockCartItems = [
  {
    id: '1',
    seller: 'Nameera by Farooq',
    caption: 'Bridal Lehenga',
    details: 'No Brand, Apparel Type: Lehenga, Color: Red, Size: M',
    price: '$500',
    quantity: 1,
    deliveryOption: 'Standard Delivery',
    deliveryFee: '$10',
    deliveryDate: 'Guarantee by 25-30 Mar',
    image: require('../assets/no1.png'),
    selected: true,
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
    image: require('../assets/no3.png'),
    selected: true,
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

  // Remove an item from the cart
  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update quantity of an item
  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change); // Prevent quantity from going below 1
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
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
      {/* Seller Name and Checkbox */}
      <View style={styles.sellerContainer}>
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
        <Text style={styles.sellerName}>{item.seller}</Text>
      </View>

      {/* Cart Item - Clickable to open ProductDetails */}
      <TouchableOpacity
        style={styles.cartItem}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            product: {
              id: item.id,
              username: item.seller.toLowerCase().replace(/\s/g, ''),
              caption: item.caption,
              price: item.price,
              postImage: item.image,
              profileImage: 'https://via.placeholder.com/40',
              size: item.details.includes('Size') ? item.details.split('Size: ')[1] : 'N/A',
              color: item.details.includes('Color') ? item.details.split('Color: ')[1]?.split(',')[0] || item.details.split('Color Family: ')[1] : 'N/A',
            },
          });
        }}
      >
        <Image source={item.image} style={styles.cartImage} />
        <View style={styles.cartDetails}>
          <Text style={styles.cartCaption}>{item.caption}</Text>
          <Text style={styles.cartDetailsText}>{item.details}</Text>
          <Text style={styles.cartPrice}>{item.price}</Text>
          {/* Quantity Editor and Remove Button */}
          <View style={styles.quantityAndRemoveContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, -1)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Delivery Option */}
      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryText}>
          {item.deliveryOption}, {item.deliveryFee}, {item.deliveryDate}
        </Text>
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
    padding: 15,
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
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxContainer: {
    marginRight: 10, // Space between checkbox and seller name
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  quantityAndRemoveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#333',
  },
  quantityText: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#B577CD',
  },
  deliveryContainer: {
    marginTop: 10,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
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
    bottom: 80,
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
    backgroundColor: '#B577CD',
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