import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav'; // Import BottomNav

const posts = [
  {
    id: '1',
    username: 'Nameera by Farooq',
    profileImage: 'https://via.placeholder.com/40',
    postImage: 'https://images.unsplash.com/photo-1603808033171-37e2c8d6e2b1?w=300',
    caption: 'Gharara Kameez Dupatta Style',
    price: '$2,499.00',
    likes: 8,
    comments: 0,
  },
  {
    id: '2',
    username: 'Fareya Borhan',
    profileImage: 'https://via.placeholder.com/40',
    postImage: 'https://images.unsplash.com/photo-1603808033192-0c243029a2ec?w=300',
    caption: 'Elegant Saree Collection',
    price: '$1,200.00',
    likes: 15,
    comments: 3,
  },
  {
    id: '3',
    username: 'Khuti - A place to depend on',
    profileImage: 'https://via.placeholder.com/40',
    postImage: 'https://images.unsplash.com/photo-1603808033176-53e9e6fd7e62?w=300',
    caption: 'Traditional Salwar Kameez',
    price: '$800.00',
    likes: 5,
    comments: 1,
  },
];

const Home = ({ navigation }) => {
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

  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.postContainer}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.postImage }} style={styles.postImage} />
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCart} onPress={() => addToCart(item)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.price}>{item.price} | Free shipping</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sharaya</Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />
      <BottomNav navigation={navigation} activeRoute="Home" />
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
  feed: {
    paddingBottom: 60, // Ensure content doesn't overlap with the nav bar
  },
  postContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  addToCart: {
    backgroundColor: '#B577CD',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
    color: '#666',
  },
});

export default Home;