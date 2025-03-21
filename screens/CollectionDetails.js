import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CollectionDetails = ({ route, navigation }) => {
  const { collection } = route.params;

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
      alert(`${item.caption} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.postImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemCaption}>{item.caption}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collection.name}</Text>
        <View style={styles.placeholder} />
      </View>
      {collection.items.length === 0 ? (
        <Text style={styles.emptyText}>No items in this collection.</Text>
      ) : (
        <FlatList
          data={collection.items}
          renderItem={renderCollectionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 48, // To balance the header layout
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
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
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  addToCartButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default CollectionDetails;