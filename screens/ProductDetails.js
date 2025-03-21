// screens/ProductDetails.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetails = ({ route, navigation }) => {
  const { product } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [sizeGuideModalVisible, setSizeGuideModalVisible] = useState(false);

  // Available sizes
  const sizes = ['Small', 'Medium', 'Large', 'X-Large'];

  // Size guide data (measurements in inches)
  const sizeGuide = [
    { size: 'Small', bust: '32-34', waist: '26-28', length: '40' },
    { size: 'Medium', bust: '35-37', waist: '29-31', length: '41' },
    { size: 'Large', bust: '38-40', waist: '32-34', length: '42' },
    { size: 'X-Large', bust: '41-43', waist: '35-37', length: '43' },
  ];

  // Define postImages for the first product (ID '1') directly in ProductDetails.js
  let postImagesForProduct1;
  try {
    postImagesForProduct1 = [
      require('../assets/no5.png'),
      require('../assets/no4.png'),
      require('../assets/no6.png'),
      require('../assets/no7.png'),
      require('../assets/no8.png'),
    ];
    console.log('Successfully loaded postImagesForProduct1:', postImagesForProduct1);
  } catch (error) {
    console.error('Error loading postImagesForProduct1:', error);
    postImagesForProduct1 = [];
  }

  // Use postImages for product ID '1', otherwise fall back to postImage
  const images = product.id === '1' ? postImagesForProduct1 : [product.postImage];
  console.log('Images array for product ID', product.id, ':', images);

  // Load collections and reviews on component mount
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

    const loadReviews = async () => {
      try {
        const reviewsString = await AsyncStorage.getItem(`reviews_${product.id}`);
        const loadedReviews = reviewsString ? JSON.parse(reviewsString) : [];
        setReviews(loadedReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    loadCollections();
    loadReviews();
  }, [product.id]);

  const addToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Error', 'Please select a size before adding to cart.');
      return;
    }

    try {
      const cartItemsString = await AsyncStorage.getItem('cartItems');
      let cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];

      const existingItem = cartItems.find(
        (cartItem) => cartItem.id === product.id && cartItem.size === selectedSize
      );
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cartItems.push({ ...product, quantity: 1, size: selectedSize });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert(`${product.caption} (Size: ${selectedSize}) added to cart!`);
      setSelectedSize(null);
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

  const submitReview = async () => {
    if (newReviewRating === 0) {
      Alert.alert('Error', 'Please select a rating.');
      return;
    }
    if (!newReviewText.trim()) {
      Alert.alert('Error', 'Please enter a review.');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      reviewerName: 'Customer',
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString(),
    };

    try {
      const updatedReviews = [...reviews, newReview];
      await AsyncStorage.setItem(`reviews_${product.id}`, JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
      setReviewModalVisible(false);
      setNewReviewRating(0);
      setNewReviewText('');
      Alert.alert('Success', 'Your review has been submitted!');
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
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

  const renderImageItem = ({ item }) => {
    console.log('Rendering image:', item);
    return (
      <Image
        source={typeof item === 'string' ? { uri: item } : item}
        style={styles.productImage}
        onError={(error) => console.log('Image loading error:', error.nativeEvent)}
      />
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{item.reviewerName}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? 'star' : 'star-outline'}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <Text style={styles.reviewDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  const renderSizeGuideItem = ({ item }) => (
    <View style={styles.sizeGuideRow}>
      <Text style={styles.sizeGuideCell}>{item.size}</Text>
      <Text style={styles.sizeGuideCell}>{item.bust}</Text>
      <Text style={styles.sizeGuideCell}>{item.waist}</Text>
      <Text style={styles.sizeGuideCell}>{item.length}</Text>
    </View>
  );

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / event.nativeEvent.layoutMeasurement.width);
    setCurrentImageIndex(index);
  };

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
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => `image-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            />
          ) : (
            <Text style={{ textAlign: 'center', padding: 20 }}>
              No images available
            </Text>
          )}
          {images.length > 1 && (
            <View style={styles.paginationDots}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: index === currentImageIndex ? '#B577CD' : '#ccc' },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.caption}>{product.caption}</Text>
          <Text style={styles.price}>{product.price} | Free shipping</Text>

          <View style={styles.sellerInfo}>
            <Image
              source={
                typeof product.profileImage === 'string'
                  ? { uri: product.profileImage }
                  : product.profileImage
              }
              style={styles.profileImage}
            />
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

          {/* Size Selection with Size Guide (Moved Above Product Description) */}
          <View style={styles.sizeSection}>
            <Text style={styles.sizeHeader}>Select Size</Text>
            <TouchableOpacity onPress={() => setSizeGuideModalVisible(true)}>
              <Text style={styles.sizeGuideLink}>Size Guide</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sizeContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeButtonSelected,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeText,
                    selectedSize === size && styles.sizeTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.descriptionHeader}>Product Description</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Text>

          {/* Review Section */}
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewsHeader}>Customer Reviews</Text>
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id}
                style={styles.reviewsList}
              />
            ) : (
              <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
            )}
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setReviewModalVisible(true)}
            >
              <Text style={styles.addReviewButtonText}>Add a Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Save to Collection/Favorites Modal */}
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

      {/* Add Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Your Review</Text>
            <Text style={styles.ratingLabel}>Rating:</Text>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setNewReviewRating(index + 1)}
                >
                  <Ionicons
                    name={index < newReviewRating ? 'star' : 'star-outline'}
                    size={30}
                    color="#FFD700"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              value={newReviewText}
              onChangeText={setNewReviewText}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.submitReviewButton}
              onPress={submitReview}
            >
              <Text style={styles.submitReviewButtonText}>Submit Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => {
                setReviewModalVisible(false);
                setNewReviewRating(0);
                setNewReviewText('');
              }}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Size Guide Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sizeGuideModalVisible}
        onRequestClose={() => setSizeGuideModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Size Guide</Text>
            <Text style={styles.sizeGuideNote}>
              Measurements are in inches. Please use this guide to select the appropriate size.
            </Text>
            <View style={styles.sizeGuideTable}>
              <View style={styles.sizeGuideHeader}>
                <Text style={styles.sizeGuideHeaderCell}>Size</Text>
                <Text style={styles.sizeGuideHeaderCell}>Bust</Text>
                <Text style={styles.sizeGuideHeaderCell}>Waist</Text>
                <Text style={styles.sizeGuideHeaderCell}>Length</Text>
              </View>
              <FlatList
                data={sizeGuide}
                renderItem={renderSizeGuideItem}
                keyExtractor={(item) => item.size}
              />
            </View>
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setSizeGuideModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Close</Text>
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
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
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
  sizeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sizeHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sizeGuideLink: {
    fontSize: 16,
    color: '#B577CD',
    textDecorationLine: 'underline',
  },
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  sizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  sizeButtonSelected: {
    borderColor: '#B577CD',
    backgroundColor: '#B577CD',
  },
  sizeText: {
    fontSize: 16,
    color: '#333',
  },
  sizeTextSelected: {
    color: '#fff',
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
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  reviewsList: {
    marginBottom: 20,
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addReviewButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  ratingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  submitReviewButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sizeGuideNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  sizeGuideTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  sizeGuideHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sizeGuideHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sizeGuideRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sizeGuideCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default ProductDetails;