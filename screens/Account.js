// screens/Account.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';
import CustomText from '../components/CustomText';

// Placeholder data for followed accounts
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
        let favoritesData = favoritesString ? JSON.parse(favoritesString) : [];

        // If no favorites, add some test data
        if (favoritesData.length === 0) {
          favoritesData = [
            {
              id: '1',
              username: 'nameera',
              profileImage: 'https://via.placeholder.com/40',
              postImage: 'https://via.placeholder.com/100',
              caption: 'Bridal Lehenga',
              price: '$500',
              size: 'M',
              color: 'Red',
            },
            {
              id: '2',
              username: 'gulnaazkhan',
              profileImage: 'https://via.placeholder.com/40',
              postImage: 'https://via.placeholder.com/100',
              caption: 'Blue Anarkali',
              price: '$300',
              size: 'S',
              color: 'Blue',
            },
          ];
          await AsyncStorage.setItem('favorites', JSON.stringify(favoritesData));
        }
        setFavorites(favoritesData);

        const collectionsString = await AsyncStorage.getItem('collections');
        let collectionsData = collectionsString ? JSON.parse(collectionsString) : [];

        // If no collections, add some test data
        if (collectionsData.length === 0) {
          collectionsData = [
            {
              name: 'Wedding Collection',
              items: [
                {
                  id: '1',
                  username: 'nameera',
                  profileImage: 'https://via.placeholder.com/40',
                  postImage: 'https://via.placeholder.com/150',
                  caption: 'Bridal Lehenga',
                  price: '$500',
                  size: 'M',
                  color: 'Red',
                },
              ],
            },
            {
              name: 'Party Wear',
              items: [
                {
                  id: '2',
                  username: 'gulnaazkhan',
                  profileImage: 'https://via.placeholder.com/40',
                  postImage: 'https://via.placeholder.com/150',
                  caption: 'Blue Anarkali',
                  price: '$300',
                  size: 'S',
                  color: 'Blue',
                },
              ],
            },
          ];
          await AsyncStorage.setItem('collections', JSON.stringify(collectionsData));
        }
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
        <CustomText weight="medium" style={styles.itemCaption}>{item.caption}</CustomText>
        <CustomText style={styles.itemPrice}>{item.price}</CustomText>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <CustomText weight="bold" style={styles.addToCartText}>Add to Cart</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromFavorites(item.id)}
          >
            <CustomText style={styles.removeButtonText}>Remove</CustomText>
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
      <CustomText style={styles.collectionName}>{item.name}</CustomText>
    </TouchableOpacity>
  );

  const renderFollowingItem = ({ item }) => (
    <View style={styles.followingItem}>
      <Image source={{ uri: item.profileImage }} style={styles.followingImage} />
      <View style={styles.followingDetails}>
        <CustomText weight="medium" style={styles.followingName}>{item.name}</CustomText>
        <CustomText style={styles.followingFollowers}>{item.followers} followers</CustomText>
      </View>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing && styles.followingButton]}
        onPress={() => toggleFollow(item.id)}
      >
        <CustomText style={[styles.followButtonText, item.isFollowing && styles.followingButtonText]}>
          {item.isFollowing ? 'Following' : 'Follow'}
        </CustomText>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <CustomText weight="bold" style={styles.profileName}>FAREYABORHAN</CustomText>
        <CustomText style={styles.profileUsername}>@fareyaborhan</CustomText>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Favorites')}
        >
          <CustomText style={[styles.tabText, activeTab === 'Favorites' && styles.activeTabText]}>
            Favorites ({favorites.length})
          </CustomText>
          {activeTab === 'Favorites' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('Following')}
        >
          <CustomText style={[styles.tabText, activeTab === 'Following' && styles.activeTabText]}>
            Following ({following.length})
          </CustomText>
          {activeTab === 'Following' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Following Header (only for Following tab) */}
      {activeTab === 'Following' && (
        <View style={styles.followingHeader}>
          <CustomText weight="medium" style={styles.followingCount}>Following ({following.length})</CustomText>
          <TouchableOpacity>
            <CustomText style={styles.seeAllText}>See all</CustomText>
          </TouchableOpacity>
        </View>
      )}

      {/* Collections Section (only for Favorites tab) */}
      {activeTab === 'Favorites' && (
        <>
          <View style={styles.collectionsHeader}>
            <CustomText weight="semiBold" style={styles.sectionTitle}>Collections</CustomText>
            <TouchableOpacity>
              <CustomText style={styles.seeAllText}>See all</CustomText>
            </TouchableOpacity>
          </View>
          {collections.length === 0 ? (
            <CustomText style={styles.emptyText}>You have no collections.</CustomText>
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
    <CustomText style={styles.emptyText}>
      {activeTab === 'Favorites' ? 'You have no favorite items.' : 'You are not following anyone.'}
    </CustomText>
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
    paddingBottom: 60,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Increased top padding to add space at the top
    
  },
  profileName: {
    fontSize: 24,
    color: '#B577CD',
  },
  profileUsername: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 10,
  },
  tab: {
    paddingVertical: 0,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#333',
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
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 8,
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
    backgroundColor: '#fff',
  },
  followingButton: {
    backgroundColor: '#333',
  },
  followButtonText: {
    fontSize: 14,
    color: '#333',
  },
  followingButtonText: {
    color: '#fff',
  },
});

export default Account;