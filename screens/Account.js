import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';

// Placeholder data for followed accounts (to be replaced with backend data later)
const followedAccounts = [
  { id: '1', name: 'Gulnaaz Khan Fashion', username: 'gulnaazkhan', followers: '6.4k', profileImage: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Nameera by Fareya', username: 'nameera', followers: '143k', profileImage: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Gulnaaz Khan Fashion', username: 'gulnaazkhan2', followers: '6.4k', profileImage: 'https://via.placeholder.com/40' },
  { id: '4', name: 'Nameera by Fareya', username: 'nameera2', followers: '143k', profileImage: 'https://via.placeholder.com/40' },
  { id: '5', name: 'Gulnaaz Khan Fashion', username: 'gulnaazkhan3', followers: '6.4k', profileImage: 'https://via.placeholder.com/40' },
  { id: '6', name: 'Nameera by Fareya', username: 'nameera3', followers: '143k', profileImage: 'https://via.placeholder.com/40' },
  { id: '7', name: 'Gulnaaz Khan Fashion', username: 'gulnaazkhan4', followers: '6.4k', profileImage: 'https://via.placeholder.com/40' },
];

const Account = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [following, setFollowing] = useState(followedAccounts.map(account => ({ ...account, isFollowing: true })));
  const [activeTab, setActiveTab] = useState('Favorites');

  // Load favorites and collections from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const favoritesString = await AsyncStorage.getItem('favorites');
        const favoritesData = favoritesString ? JSON.parse(favoritesString) : [];
        setFavorites(favoritesData);

        const collectionsString = await AsyncStorage.getItem('collections');
        const collectionsData = collectionsString ? JSON.parse(collectionsString) : [];
        setCollections(collectionsData);
      } catch (error) {
        console.error('Error loading account data:', error);
      }
    };
    loadData();
  }, []);

  // Remove an item from Favorites
  const removeFromFavorites = async (itemId) => {
    try {
      const updatedFavorites = favorites.filter((item) => item.id !== itemId);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Item removed from Favorites.');
    } catch (error) {
      console.error('Error removing item from Favorites:', error);
      alert('Failed to remove item from Favorites. Please try again.');
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

  // Toggle follow/unfollow for an account
  const toggleFollow = (accountId) => {
    setFollowing(following.map(account => {
      if (account.id === accountId) {
        return { ...account, isFollowing: !account.isFollowing };
      }
      return account;
    }));
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.itemContainer}
    >
      <Image source={{ uri: item.postImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemCaption}>{item.caption}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromFavorites(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionContainer}
      onPress={() => navigation.navigate('CollectionDetails', { collection: item })}
    >
      <Image
        source={{ uri: item.items[0]?.postImage || 'https://via.placeholder.com/150' }}
        style={styles.collectionImage}
      />
      <Text style={styles.collectionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFollowingItem = ({ item }) => (
    <View style={styles.followingItem}>
      <Image source={{ uri: item.profileImage }} style={styles.followingImage} />
      <View style={styles.followingDetails}>
        <Text style={styles.followingName}>{item.name}</Text>
        <Text style={styles.followingFollowers}>{item.followers} followers</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing && styles.followingButton]}
        onPress={() => toggleFollow(item.id)}
      >
        <Text style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>FAREYABORHAN</Text>
        <Text style={styles.profileUsername}>@fareyaborhan</Text>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'Favorites' && styles.activeTabText]}>
            Favorites ({favorites.length})
          </Text>
          {activeTab === 'Favorites' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Following')}
        >
          <Text style={[styles.tabText, activeTab === 'Following' && styles.activeTabText]}>
            Following ({following.length})
          </Text>
          {activeTab === 'Following' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Following Header (only for Following tab) */}
      {activeTab === 'Following' && (
        <View style={styles.followingHeader}>
          <Text style={styles.followingCount}>Following ({following.length})</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Collections Section (only for Favorites tab) */}
      {activeTab === 'Favorites' && (
        <>
          <View style={styles.collectionsHeader}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {collections.length === 0 ? (
            <Text style={styles.emptyText}>You have no collections.</Text>
          ) : (
            <FlatList
              data={collections}
              renderItem={renderCollectionItem}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.collectionsList}
            />
          )}
        </>
      )}
    </>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.emptyText}>
      {activeTab === 'Favorites' ? 'You have no favorite items.' : 'You are not following anyone.'}
    </Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeTab === 'Favorites' ? favorites : following}
        renderItem={activeTab === 'Favorites' ? renderFavoriteItem : renderFollowingItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.list}
      />
      <BottomNav navigation={navigation} activeRoute="Account" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingBottom: 60, // Adjusted to account for the nav bar
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
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
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  editProfileText: {
    fontSize: 16,
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 10,
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
    width: '50%',
    height: 2,
    backgroundColor: '#333',
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: '#B577CD',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addToCartText: {
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
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#B577CD',
  },
  collectionsList: {
    paddingHorizontal: 10,
  },
  collectionContainer: {
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
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  followingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  followingCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  followingImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  followingDetails: {
    flex: 1,
  },
  followingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  followingFollowers: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff', // Light background for "Follow"
  },
  followingButton: {
    backgroundColor: '#333', // Dark background for "Following"
  },
  followButtonText: {
    fontSize: 14,
    color: '#333', // Dark text for "Follow"
  },
  followingButtonText: {
    color: '#fff', // White text for "Following"
  },
});

export default Account;