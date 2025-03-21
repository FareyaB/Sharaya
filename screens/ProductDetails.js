import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);

  // Load collections from AsyncStorage when the screen mounts
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const collectionsString = await AsyncStorage.getItem('collections');
        const loadedCollections = collectionsString ? JSON.parse(collectionsString) : [];
        setCollections(loadedCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };
    loadCollections();
  }, []);

  const addToCart = async () => {
    try {
      const cartItemsString = await AsyncStorage.getItem('cartItems');
      let cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

      const existingItem = cartItems.find((cartItem) => cartItem.id === product.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert(`${product.caption} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const saveToFavorites = async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      let favorites = favoritesString ? JSON.parse(favoritesString) : [];

      const existingItem = favorites.find((favItem) => favItem.id === product.id);
      if (existingItem) {
        alert(`${product.caption} is already in Favorites!`);
        setModalVisible(false);
        return;
      }

      favorites.push(product);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${product.caption} saved to Favorites!`);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving to Favorites:', error);
      alert('Failed to save to Favorites. Please try again.');
    }
  };

  const saveToCollection = async (collectionName) => {
    try {
      const updatedCollections = collections.map((collection) => {
        if (collection.name === collectionName) {
          const existingItem = collection.items.find((item) => item.id === product.id);
          if (existingItem) {
            alert(`${product.caption} is already in ${collectionName}!`);
            return collection;
          }
          return { ...collection, items: [...collection.items, product] };
        }
        return collection;
      });

      await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      alert(`${product.caption} saved to ${collectionName}!`);
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving to collection:', error);
      alert('Failed to save to collection. Please try again.');
    }
  };

  const createAndSaveToCollection = async () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name.');
      return;
    }

    try {
      const newCollection = { name: newCollectionName, items: [product] };
      const updatedCollections = [...collections, newCollection];
      await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));
      setCollections(updatedCollections);
      setNewCollectionName('');
      setShowNewCollectionInput(false);
      setModalVisible(false);
      alert(`${product.caption} saved to new collection: ${newCollectionName}!`);
    } catch (error) {
      console.error('Error creating new collection:', error);
      alert('Failed to create new collection. Please try again.');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() => saveToCollection(item.name)}
    >
      <Text style={styles.collectionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.saveButton}>
          <Ionicons name="bookmark-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Image source={{ uri: product.postImage }} style={styles.productImage} />
        <View style={styles.detailsContainer}>
          <Text style={styles.caption}>{product.caption}</Text>
          <Text style={styles.price}>{product.price} | Free shipping</Text>
          <View style={styles.sellerInfo}>
            <Image source={{ uri: product.profileImage }} style={styles.profileImage} />
            <Text style={styles.username}>{product.username}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#000" />
              <Text style={styles.actionText}>{product.likes} Likes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color="#000" />
              <Text style={styles.actionText}>{product.comments} Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="#000" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <Text style={styles.descriptionHeader}>Product Description</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>
        </View>
      </ScrollView>

      {/* Modal for Save Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save Product</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={saveToFavorites}
            >
              <Text style={styles.modalOptionText}>Save to Favorites</Text>
            </TouchableOpacity>
            {collections.length > 0 && (
              <FlatList
                data={collections}
                renderItem={renderCollectionItem}
                keyExtractor={(item) => item.name}
                style={styles.collectionList}
              />
            )}
            {!showNewCollectionInput ? (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setShowNewCollectionInput(true)}
              >
                <Text style={styles.modalOptionText}>Create New Collection</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.newCollectionContainer}>
                <TextInput
                  style={styles.newCollectionInput}
                  placeholder="Enter collection name"
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                />
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={createAndSaveToCollection}
                >
                  <Text style={styles.createButtonText}>Create & Save</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                setModalVisible(false);
                setShowNewCollectionInput(false);
                setNewCollectionName('');
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  caption: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  addToCartButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  collectionList: {
    width: '100%',
    maxHeight: 150,
    marginBottom: 10,
  },
  collectionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  collectionName: {
    fontSize: 16,
    color: '#333',
  },
  newCollectionContainer: {
    width: '100%',
    marginTop: 10,
  },
  newCollectionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancel: {
    marginTop: 15,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#B577CD',
  },
});

export default ProductDetails;