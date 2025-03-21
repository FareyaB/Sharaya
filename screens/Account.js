import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';

const Account = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Favorites');
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [collections, setCollections] = useState([
    { id: '1', name: 'For office', items: [] },
    { id: '2', name: 'For Eid', items: [] },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Load favorite items from AsyncStorage
  useEffect(() => {
    const loadFavoriteItems = async () => {
      try {
        const favoriteItemsString = await AsyncStorage.getItem('favoriteItems');
        const items = favoriteItemsString ? JSON.parse(favoriteItemsString) : [];
        setFavoriteItems(items);
      } catch (error) {
        console.error('Error loading favorite items:', error);
      }
    };
    loadFavoriteItems();
  }, []);

  // Remove an item from favorites
  const removeFromFavorites = async (itemId) => {
    try {
      const updatedFavorites = favoriteItems.filter((item) => item.id !== itemId);
      setFavoriteItems(updatedFavorites);
      await AsyncStorage.setItem('favoriteItems', JSON.stringify(updatedFavorites));
      alert('Item removed from favorites.');
    } catch (error) {
      console.error('Error removing item from favorites:', error);
      alert('Failed to remove item from favorites. Please try again.');
    }
  };

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
      alert(`${item.caption} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  // Create a new collection
  const createCollection = () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name.');
      return;
    }
    const newCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      items: [],
    };
    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setModalVisible(false);
  };

  // Render favorite item
  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.favoriteItem}
    >
      <Image source={{ uri: item.postImage }} style={styles.favoriteImage} />
      <Text style={styles.favoriteCaption}>{item.caption}</Text>
      <Text style={styles.favoritePrice}>{item.price}</Text>
      <TouchableOpacity
        style={styles.favoriteAddToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.favoriteAddToCartText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Render collection
  const renderCollection = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() => navigation.navigate('CollectionDetails', { collection: item })}
    >
      <Image
        source={
          item.items.length > 0
            ? { uri: item.items[0].postImage }
            : { uri: 'https://via.placeholder.com/150' }
        }
        style={styles.collectionImage}
      />
      <Text style={styles.collectionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>FAREYABORHAN</Text>
          <Text style={styles.profileUsername}>@fareyaborhan</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setActiveTab('Favorites')}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Favorites' && styles.activeTabText,
              ]}
            >
              Favorites ({favoriteItems.length})
            </Text>
            {activeTab === 'Favorites' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('Following')}
            style={styles.tab}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Following' && styles.activeTabText,
              ]}
            >
              Following
            </Text>
            {activeTab === 'Following' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'Favorites' ? (
          <>
            {/* Collections Section */}
            <View style={styles.collectionsSection}>
              <View style={styles.collectionsHeader}>
                <Text style={styles.sectionTitle}>Collections</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={styles.createCollectionText}>+ Create</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={collections}
                renderItem={renderCollection}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.collectionsList}
              />
            </View>

            {/* Favorites Section */}
            <View style={styles.favoritesSection}>
              <View style={styles.favoritesHeader}>
                <Text style={styles.sectionTitle}>Favorites ({favoriteItems.length})</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              {favoriteItems.length === 0 ? (
                <Text style={styles.emptyText}>You have no favorite items.</Text>
              ) : (
                <FlatList
                  data={favoriteItems}
                  renderItem={renderFavoriteItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  contentContainerStyle={styles.favoritesList}
                />
              )}
            </View>
          </>
        ) : (
          <View style={styles.followingSection}>
            <Text style={styles.emptyText}>Following section to be implemented.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} activeRoute="Account" />

      {/* Modal for Creating a New Collection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Collection</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Collection Name"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createCollection}
                style={[styles.modalButton, styles.modalButtonCreate]}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonCreateText]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 60, // Account for bottom nav bar
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  editProfileText: {
    fontSize: 16,
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tabUnderline: {
    height: 2,
    backgroundColor: '#333',
    width: '50%',
    marginTop: 5,
  },
  collectionsSection: {
    paddingVertical: 20,
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  createCollectionText: {
    fontSize: 16,
    color: '#B577CD',
  },
  collectionsList: {
    paddingHorizontal: 15,
  },
  collectionItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  collectionImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  collectionName: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  favoritesSection: {
    paddingVertical: 20,
  },
  favoritesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 16,
    color: '#B577CD',
  },
  favoritesList: {
    paddingHorizontal: 15,
  },
  favoriteItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  favoriteImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  favoriteCaption: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  favoritePrice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  favoriteAddToCartButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 5,
  },
  favoriteAddToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  followingSection: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalButtonCreate: {
    backgroundColor: '#B577CD',
  },
  modalButtonCreateText: {
    color: '#fff',
  },
});

export default Account;