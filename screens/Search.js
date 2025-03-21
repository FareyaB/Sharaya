// screens/Search.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, Modal, SafeAreaView, ScrollView, Alert, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import BottomNav from '../components/BottomNav';

// Hardcoded posts data with latitude and longitude (to simulate location-based filtering)
const posts = [
  { id: '1', username: 'nameera', caption: 'Bridal Lehenga', price: '$500', postImage: require('../assets/no1.png'), profileImage: 'https://via.placeholder.com/40', size: 'M', color: 'Red', latitude: 23.8103, longitude: 90.4125 }, // Dhaka, Bangladesh
  { id: '2', username: 'gulnaazkhan', caption: 'Blue Anarkali', price: '$300', postImage: require('../assets/no3.png'), profileImage: 'https://via.placeholder.com/40', size: 'S', color: 'Blue', latitude: 23.8041, longitude: 90.4152 }, // Nearby Dhaka
  { id: '3', username: 'nameera', caption: 'Red Bridal Dress', price: '$600', postImage: require('../assets/no5.png'), profileImage: 'https://via.placeholder.com/40', size: 'L', color: 'Red', latitude: 24.8607, longitude: 67.0011 }, // Karachi, Pakistan
  { id: '4', username: 'gulnaazkhan', caption: 'White Gown', price: '$400', postImage: require('../assets/no9.png'), profileImage: 'https://via.placeholder.com/40', size: 'XS', color: 'White', latitude: 22.5726, longitude: 88.3639 }, // Kolkata, India
];

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [radius, setRadius] = useState(50);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [sizeDropdownVisible, setSizeDropdownVisible] = useState(false);
  const [colorDropdownVisible, setColorDropdownVisible] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const suggestedSellers = [
    { id: '1', name: 'Nameera by Farooq', username: 'nameera' },
    { id: '2', name: 'Gulnaaz Khan Fashion', username: 'gulnaazkhan' },
  ];

  const sizes = ['XS', 'S', 'Regular', 'M', 'L', 'XL'];
  const colors = ['Carmine Red', 'White', 'Blue', 'Green'];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        setSelectedLocation({
          latitude: 23.8103,
          longitude: 90.4125,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      }
      if (galleryStatus.status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
      }
    })();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const applyFilters = () => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(post => {
      const price = parseFloat(post.price.replace('$', ''));
      return price >= 1 && price <= maxPrice;
    });

    if (selectedSize) {
      filtered = filtered.filter(post => post.size === selectedSize);
    }

    if (selectedColor) {
      filtered = filtered.filter(post => post.color === selectedColor);
    }

    if (selectedSellers.length > 0) {
      filtered = filtered.filter(post => selectedSellers.includes(post.username));
    }

    if (selectedLocation) {
      filtered = filtered.filter(post => {
        const distance = calculateDistance(
          selectedLocation.latitude,
          selectedLocation.longitude,
          post.latitude,
          post.longitude
        );
        return distance <= radius;
      });
    }

    setFilteredPosts(filtered);
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setMaxPrice(1000);
    setSelectedSize('');
    setSelectedColor('');
    setSelectedLocation(null);
    setRadius(50);
    setSelectedSellers([]);
    setSizeDropdownVisible(false);
    setColorDropdownVisible(false);
    setFilteredPosts(posts);
  };

  const toggleSeller = (username) => {
    setSelectedSellers(prev =>
      prev.includes(username)
        ? prev.filter(seller => seller !== username)
        : [...prev, username]
    );
  };

  const handleLocateMe = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImagePickerModalVisible(false);
      searchSimilarProducts(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImagePickerModalVisible(false);
      searchSimilarProducts(result.assets[0].uri);
    }
  };

  const searchSimilarProducts = (imageUri) => {
    const mockRecognitionResult = { color: 'Red', type: 'Dress' };
    const filtered = posts.filter(post => {
      const matchesColor = post.color.toLowerCase() === mockRecognitionResult.color.toLowerCase();
      const matchesType = post.caption.toLowerCase().includes(mockRecognitionResult.type.toLowerCase());
      return matchesColor && matchesType;
    });

    setFilteredPosts(filtered);
    setSearchQuery(`Similar to ${mockRecognitionResult.color} ${mockRecognitionResult.type}`);
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={item.postImage} style={styles.postImage} />
    </TouchableOpacity>
  );

  const renderSellerItem = ({ item }) => (
    <View style={styles.sellerItem}>
      <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.sellerImage} />
      <Text style={styles.sellerName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleSeller(item.username)}
      >
        <Ionicons
          name={selectedSellers.includes(item.username) ? 'checkbox' : 'square-outline'}
          size={24}
          color={selectedSellers.includes(item.username) ? '#B577CD' : '#333'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar with Filters and Camera Button */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            applyFilters();
          }}
        />
        <TouchableOpacity
          style={styles.imageSearchButton}
          onPress={() => setImagePickerModalVisible(true)}
        >
          <Ionicons name="camera" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filtersButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.filtersButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Body types</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Walima</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>South asian</Text>
        </TouchableOpacity>
      </View>

      {/* Display selected image (if any) */}
      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Text style={styles.selectedImageText}>Selected Image:</Text>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        </View>
      )}

      {/* Search Results */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
      />

      {/* Image Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imagePickerModalVisible}
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setImagePickerModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.imagePickerModalContent}>
                <Text style={styles.modalTitle}>Search by Image</Text>
                <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                  <Text style={styles.imagePickerButtonText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImageFromGallery}>
                  <Text style={styles.imagePickerButtonText}>Select from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imagePickerCancelButton}
                  onPress={() => setImagePickerModalVisible(false)}
                >
                  <Text style={styles.imagePickerCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.modalScrollContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filters</Text>
                    <TouchableOpacity onPress={resetFilters}>
                      <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Price Range */}
                  <Text style={styles.filterLabel}>Price range</Text>
                  <View style={styles.priceRangeContainer}>
                    <Text style={styles.priceText}>$1</Text>
                    <Text style={styles.priceText}>${maxPrice === 1000 ? '612+' : maxPrice}</Text>
                  </View>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={1000}
                    value={maxPrice}
                    onValueChange={value => setMaxPrice(value)}
                    minimumTrackTintColor="#B577CD"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#B577CD"
                  />
                  <Text style={styles.sliderLabel}>Drag to change max price</Text>

                  {/* Size */}
                  <Text style={styles.filterLabel}>Size</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setSizeDropdownVisible(!sizeDropdownVisible)}
                  >
                    <Text style={styles.dropdownText}>
                      {selectedSize || 'Select size'}
                    </Text>
                    <Ionicons
                      name={sizeDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {sizeDropdownVisible && (
                    <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                      {sizes.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedSize(item);
                            setSizeDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  {/* Color */}
                  <Text style={styles.filterLabel}>Color</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setColorDropdownVisible(!colorDropdownVisible)}
                  >
                    <Text style={styles.dropdownText}>
                      {selectedColor || 'Select color'}
                    </Text>
                    <Ionicons
                      name={colorDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {colorDropdownVisible && (
                    <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                      {colors.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedColor(item);
                            setColorDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}

                  {/* Add Personalization (Placeholder) */}
                  <TouchableOpacity style={styles.personalizationButton}>
                    <Text style={styles.personalizationText}>Add personalization</Text>
                  </TouchableOpacity>

                  {/* Location */}
                  <Text style={styles.filterLabel}>Location</Text>
                  {selectedLocation ? (
                    <MapView
                      style={styles.map}
                      initialRegion={selectedLocation}
                      region={selectedLocation}
                    >
                      <Marker coordinate={{ latitude: selectedLocation.latitude, longitude: selectedLocation.longitude }} />
                    </MapView>
                  ) : (
                    <View style={styles.mapPlaceholder}>
                      <Text style={styles.mapText}>Loading map...</Text>
                    </View>
                  )}
                  <Text style={styles.locationText}>
                    {selectedLocation ? 'Current Location' : 'Select a location'}
                  </Text>
                  <Text style={styles.locationSubText}>Radius: {radius} km</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={100}
                    value={radius}
                    onValueChange={value => setRadius(value)}
                    minimumTrackTintColor="#B577CD"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#B577CD"
                  />
                  <TouchableOpacity style={styles.locateMeButton} onPress={handleLocateMe}>
                    <Text style={styles.locateMeText}>Locate me</Text>
                  </TouchableOpacity>

                  {/* Sellers */}
                  <Text style={styles.filterLabel}>Sellers</Text>
                  <ScrollView style={styles.sellersList} nestedScrollEnabled={true}>
                    {suggestedSellers.map((item) => (
                      <View key={item.id}>
                        {renderSellerItem({ item })}
                      </View>
                    ))}
                  </ScrollView>

                  {/* View Results Button */}
                  <TouchableOpacity style={styles.viewResultsButton} onPress={applyFilters}>
                    <Text style={styles.viewResultsText}>View results</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <BottomNav navigation={navigation} activeRoute="Search" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#B577CD',
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#B577CD',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginHorizontal: 10,
  },
  imageSearchButton: {
    padding: 5,
    marginRight: 5,

  },
  filtersButton: {
    borderWidth: 1,
    borderColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  filtersButtonText: {
    fontSize: 16,
    color: '#B577CD',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  selectedImageContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedImageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  postsList: {
    paddingHorizontal: 5,
    paddingBottom: 60,
  },
  postContainer: {
    flex: 1,
    margin: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  imagePickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 100,
    alignItems: 'center',
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resetText: {
    fontSize: 16,
    color: '#B577CD',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 14,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  personalizationButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  personalizationText: {
    fontSize: 16,
    color: '#333',
  },
  map: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapText: {
    fontSize: 14,
    color: '#666',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  locationSubText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  locateMeButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  locateMeText: {
    fontSize: 16,
    color: '#fff',
  },
  sellersList: {
    marginBottom: 20,
  },
  sellerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sellerName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    padding: 5,
  },
  viewResultsButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  viewResultsText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  imagePickerCancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  imagePickerCancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Search;