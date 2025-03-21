// screens/Home.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Share,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

// Mock posts data (used for both posts and stories)
const posts = [
  {
    id: '1',
    username: 'Nameera by Farooq',
    profileImage: require('../assets/no2.png'),
    postImage: require('../assets/no5.png'), // Single image for the Home page
    caption: 'Gharara Kameez Dupatta Style',
    price: 'Tk 2,499.00',
    likes: 8,
    comments: 0,
  },
  {
    id: '2',
    username: 'Niya Collections',
    profileImage: require('../assets/no6.png'),
    postImage: require('../assets/no1.png'),
    caption: 'Elegant Saree Collection',
    price: 'Tk 1,200.00',
    likes: 15,
    comments: 3,
  },
  {
    id: '3',
    username: 'Khuti - A place to depend on',
    profileImage: require('../assets/no1.png'),
    postImage: 'https://images.unsplash.com/photo-1603808033176-53e9e6fd7e62?w=300',
    caption: 'Traditional Salwar Kameez',
    price: 'Tk 800.00',
    likes: 5,
    comments: 1,
  },
];

// Mock stories data (derived from posts, plus 2 additional stories)
const stories = [
  {
    id: 'story-0',
    username: 'Sana’s Boutique',
    profileImage: require('../assets/no10.png'),
  },
  {
    id: 'story-1',
    username: 'Zara Fashions',
    profileImage: require('../assets/no9.png'),
  },
  ...posts.map((post, index) => ({
    id: `story-${index + 2}`,
    username: post.username,
    profileImage: post.profileImage,
  })),
];

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [collections, setCollections] = useState(['Favorites', 'Wedding', 'Casual']);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [savedItems, setSavedItems] = useState({});

  const userRole = 'customer';

  const handleMessage = (username) => {
    Alert.alert('Message', `Start a chat with ${username}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => console.log(`Messaging ${username}`) },
    ]);
  };

  const handleShare = async (post) => {
    try {
      const shareUrl = `https://sharaya.app/product/${post.id}`;
      await Share.share({
        message: `Check out this ${post.caption} by ${post.username} on Sharaya! ${shareUrl}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the product.');
    }
  };

  const handleSave = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const saveToCollection = (collectionName) => {
    setSavedItems(prev => ({
      ...prev,
      [selectedPost.id]: collectionName,
    }));
    Alert.alert('Success', `Saved to ${collectionName}!`);
    setModalVisible(false);
    setNewCollectionName('');
  };

  const createNewCollection = () => {
    if (!newCollectionName) {
      Alert.alert('Error', 'Please enter a collection name.');
      return;
    }
    setCollections(prev => [...prev, newCollectionName]);
    saveToCollection(newCollectionName);
  };

  const handleStoryPress = (username) => {
    Alert.alert('Story', `Viewing ${username}'s story`, [
      { text: 'Close', style: 'cancel' },
    ]);
  };

  const renderStory = ({ item }) => (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={() => handleStoryPress(item.username)}
    >
      <Image
        source={
          typeof item.profileImage === 'string'
            ? { uri: item.profileImage }
            : item.profileImage
        }
        style={styles.storyImage}
      />
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      style={styles.postContainer}
    >
      <View style={styles.postHeader}>
        <Image
          source={
            typeof item.profileImage === 'string'
              ? { uri: item.profileImage }
              : item.profileImage
          }
          style={styles.profileImage}
        />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Image
        source={item.postImage}
        style={styles.postImage}
      />
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#000" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleMessage(item.username)}>
          <Ionicons name="paper-plane-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSave(item)}>
          <Ionicons name="bookmark-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.caption}>{item.caption}</Text>
      <Text style={styles.price}>{item.price} | Free shipping</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.header}>Sharaya</Text>
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesList}
          contentContainerStyle={styles.storiesContent}
        />
      </SafeAreaView>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feed}
      />
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Save to Collection</Text>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection}
                style={styles.collectionItem}
                onPress={() => saveToCollection(collection)}
              >
                <Text style={styles.collectionText}>{collection}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              placeholder="New Collection Name"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <TouchableOpacity style={styles.createButton} onPress={createNewCollection}>
              <Text style={styles.createButtonText}>Create New Collection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: '#B577CD',
  },
  storiesList: {
    marginBottom: 5,
  },
  storiesContent: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#B577CD',
  },
  storyUsername: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
    maxWidth: 60,
  },
  feed: {
    paddingBottom: 60,
  },
  postContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  profileImage: {
    width: 39,
    height: 39,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  caption: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingBottom: 3,
    color: '#333',
  },
  price: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 8,
    color: '#666',
  },
  modalContainer: {
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  collectionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  collectionText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#B577CD',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#B577CD',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#B577CD',
  },
});

export default Home;