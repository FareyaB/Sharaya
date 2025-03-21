// screens/Checkout.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Checkout = ({ navigation, route }) => {
  const { cartItems, totalPrice } = route.params; // Get cart items and total price from Cart screen

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Fareya Borhan',
    addressLine1: '123 Main Street',
    addressLine2: '',
    city: 'Dhaka',
    state: 'Dhaka',
    postalCode: '1205',
    country: 'Bangladesh',
    phoneNumber: '+8801234567890',
  });

  const [usePickupPoint, setUsePickupPoint] = useState(false); // Toggle for pickup point
  const [paymentMethod, setPaymentMethod] = useState(null); // Placeholder for payment method

  const handleInputChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalPriceWithDelivery = () => {
    const basePrice = parseFloat(totalPrice.replace('$', ''));
    const deliveryFee = cartItems.reduce((total, item) => {
      const fee = parseFloat(item.deliveryFee.replace('$', ''));
      return total + fee;
    }, 0);
    return (basePrice + (usePickupPoint ? 0 : deliveryFee)).toFixed(2);
  };

  const finalTotalPrice = `$${calculateTotalPriceWithDelivery()}`;

  const handlePlaceOrder = () => {
    // Validate shipping address
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phoneNumber
    ) {
      Alert.alert('Error', 'Please fill in all required shipping address fields.');
      return;
    }

    // Mock payment processing (we'll integrate Stripe later)
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method.');
      return;
    }

    // Mock order confirmation
    const order = {
      cartItems,
      totalPrice: finalTotalPrice,
      shippingAddress,
      paymentMethod,
      orderDate: new Date().toISOString(),
      status: 'Pending',
      usePickupPoint,
    };

    // In a real app, we would save the order to Firestore here
    console.log('Order placed:', order);

    Alert.alert('Success', 'Your order has been placed successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </SafeAreaView>

      {/* Shipping Address Display */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>
          {shippingAddress.fullName}, {shippingAddress.addressLine1}, {shippingAddress.city} - {shippingAddress.postalCode}, {shippingAddress.country}
        </Text>
        <View style={styles.pickupContainer}>
          <Text style={styles.pickupText}>
            Collect your parcel from the nearest Pickup Point with a reduced shipping fee
          </Text>
          <Switch
            value={usePickupPoint}
            onValueChange={setUsePickupPoint}
            trackColor={{ false: '#ddd', true: '#B577CD' }}
            thumbColor={usePickupPoint ? '#fff' : '#fff'}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.suggestedPointsText}>1 suggested collection point(s) nearby</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Shipping Address Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Edit Shipping Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={shippingAddress.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address Line 1 *"
          value={shippingAddress.addressLine1}
          onChangeText={(text) => handleInputChange('addressLine1', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Address Line 2"
          value={shippingAddress.addressLine2}
          onChangeText={(text) => handleInputChange('addressLine2', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="City *"
          value={shippingAddress.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="State/Province *"
          value={shippingAddress.state}
          onChangeText={(text) => handleInputChange('state', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Postal Code *"
          value={shippingAddress.postalCode}
          onChangeText={(text) => handleInputChange('postalCode', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Country *"
          value={shippingAddress.country}
          onChangeText={(text) => handleInputChange('country', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          value={shippingAddress.phoneNumber}
          onChangeText={(text) => handleInputChange('phoneNumber', text)}
          keyboardType="phone-pad"
        />
      </View>

      {/* Payment Method (Placeholder) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => setPaymentMethod('Stripe')} // Mock selection
        >
          <Text style={styles.paymentButtonText}>Pay with Stripe (Mock)</Text>
        </TouchableOpacity>
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.orderItemText}>{item.caption}</Text>
            <Text style={styles.orderItemText}>{item.price}</Text>
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>{finalTotalPrice}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 15, // Reduced padding for better accessibility
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  pickupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickupText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  suggestedPointsText: {
    fontSize: 14,
    color: '#B577CD', // Light purple for links
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: '#B577CD', // Light purple color
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderItemText: {
    fontSize: 16,
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeOrderButton: {
    backgroundColor: '#B577CD', // Light purple color
    borderRadius: 5,
    padding: 15,
    margin: 20,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Checkout;