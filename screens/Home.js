// screens/Home.js
import React, { useState, useEffect } from 'react';
import {
  View,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';
import CustomText from '../components/CustomText';

// Import the Sharaya logo
const sharayaLogo = require('../assets/sharaya-logo-modified.png');

// Mock posts data (used for both posts and stories)
const initialPosts = [
  {
    id: '1',
    username: 'Nameera by Farooq',
    profileImage: require('../assets/no2.png'),
    postImage: require('../assets/no5.png'),
    caption: 'Gharara Kameez Dupatta Style',
    price: 'Tk 2,499.00',
    likes: 8,
    comments: [],
  },
  {
    id: '2',
    username: 'Niya Collections',
    profileImage: require('../assets/no6.png'),
    postImage: require('../assets/no1.png'),
    caption: 'Elegant Saree Collection',
    price: 'Tk 1,200.00',
    likes: 15,
    comments: [],
  },
  {
    id: '3',
    username: 'Khuti - A place to depend on',
    profileImage: require('../assets/no1.png'),
    postImage: 'https://images.unsplash.com/photo-1603808033176-53e9e6fd7e62?w=300',
    caption: 'Traditional Salwar Kameez',
    price: 'Tk 800.00',
    likes: 5,
    comments: [],
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
  ...initialPosts.map((post, index) => ({
    id: `story-${index + 2}`,
    username: post.username,
    profileImage: post.profileImage,
  })),
];

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false); // New state for message modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newMessage, setNewMessage] = useState(''); // New state for message input
  const [chatHistory, setChatHistory] = useState({}); // State to store chat history
  const [collections, setCollections] = useState(['Favorites', 'Wedding', 'Casual']);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [savedItems, setSavedItems] = useState({});

  const userRole = 'customer';

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load liked posts
        const likedPostsString = await AsyncStorage.getItem('likedPosts');
        if (likedPostsString) {
          setLikedPosts(JSON.parse(likedPostsString));
        }

        // Load posts with comments
        const postsString = await AsyncStorage.getItem('posts');
        if (postsString) {
          setPosts(JSON.parse(postsString));
        } else {
          await AsyncStorage.setItem('posts', JSON.stringify(initialPosts));
        }

        // Load chat history
        const chatHistoryString = await AsyncStorage.getItem('chatHistory');
        if (chatHistoryString) {
          setChatHistory(JSON.parse(chatHistoryString));
        }

        // Load collections
        const collectionsString = await AsyncStorage.getItem('collections');
        if (collectionsString) {
          setCollections(JSON.parse(collectionsString));
        } else {
          await AsyncStorage.setItem('collections', JSON.stringify(['Favorites', 'Wedding', 'Casual']));
        }

        // Load saved items
        const savedItemsString = await AsyncStorage.getItem('savedItems');
        if (savedItemsString) {
          setSavedItems(JSON.parse(savedItemsString));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Handle Like button
  const handleLike = async (postId) => {
    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          const isLiked = likedPosts[postId];
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      });

      const updatedLikedPosts = {
        ...likedPosts,
        [postId]: !likedPosts[postId],
      };

      setPosts(updatedPosts);
      setLikedPosts(updatedLikedPosts);

      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      await AsyncStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Error', 'Failed to like the post. Please try again.');
    }
  };

  // Handle Comment button
  const handleComment = (post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please enter a comment.');
      return;
    }

    try {
      const updatedPosts = posts.map((post) => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              {
                id: Date.now().toString(),
                text: newComment,
                user: 'Current User',
                timestamp: new Date().toLocaleDateString(),
                profileImage: 'https://via.placeholder.com/40',
              },
            ],
          };
        }
        return post;
      });

      setPosts(updatedPosts);
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setNewComment('');
      setCommentModalVisible(false);
      Alert.alert('Success', 'Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const handleReply = (comment) => {
    Alert.alert('Reply', `Replying to ${comment.user}'s comment: ${comment.text}`);
  };

  const handleReact = (comment) => {
    Alert.alert('React', `Reacted to ${comment.user}'s comment!`);
  };

  // Handle Message button (now opens a modal)
  const handleMessage = (post) => {
    setSelectedPost(post);
    setMessageModalVisible(true);
  };

  // Send a message from the modal
  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      user: 'Current User',
      timestamp: new Date().toLocaleTimeString(),
      product: selectedPost && !chatHistory[selectedPost.username]?.some((msg) => msg.product)
        ? { caption: selectedPost.caption, image: selectedPost.postImage }
        : null,
    };

    const updatedChatHistory = {
      ...chatHistory,
      [selectedPost.username]: [...(chatHistory[selectedPost.username] || []), message],
    };

    setChatHistory(updatedChatHistory);
    setNewMessage('');

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  // Handle Share button
  const handleShare = async (post) => {
    try {
      const shareUrl = `https://sharaya.app/product/${post.id}`;
      const result = await Share.share({
        message: `Check out this ${post.caption} by ${post.username} on Sharaya! Price: ${post.price}. ${shareUrl}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Failed to share the product.');
    }
  };

  // Handle Save button
  const handleSave = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const saveToCollection = async (collectionName) => {
    try {
      const updatedSavedItems = {
        ...savedItems,
        [selectedPost.id]: collectionName,
      };

      setSavedItems(updatedSavedItems);
      await AsyncStorage.setItem('savedItems', JSON.stringify(updatedSavedItems));
      Alert.alert('Success', `Saved to ${collectionName}!`);
      setModalVisible(false);
      setNewCollectionName('');
    } catch (error) {
      console.error('Error saving to collection:', error);
      Alert.alert('Error', 'Failed to save to collection. Please try again.');
    }
  };

  const createNewCollection = async () => {
    if (!newCollectionName.trim()) {
      Alert.alert('Error', 'Please enter a collection name.');
      return;
    }

    try {
      const updatedCollections = [...collections, newCollectionName];
      setCollections(updatedCollections);
      await AsyncStorage.setItem('collections', JSON.stringify(updatedCollections));
      saveToCollection(newCollectionName);
    } catch (error) {
      console.error('Error creating new collection:', error);
      Alert.alert('Error', 'Failed to create new collection. Please try again.');
    }
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
      <CustomText style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </CustomText>
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
        <CustomText weight="bold" style={styles.username}>{item.username}</CustomText>
      </View>
      <Image
        source={item.postImage}
        style={styles.postImage}
      />
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
          <Ionicons
            name={likedPosts[item.id] ? 'heart' : 'heart-outline'}
            size={24}
            color={likedPosts[item.id] ? '#FF0000' : '#000'}
          />
          <CustomText style={styles.actionText}>{item.likes}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item)}>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
          <CustomText style={styles.actionText}>{item.comments.length}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleMessage(item)}>
          <Ionicons name="paper-plane-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleSave(item)}>
          <Ionicons name="bookmark-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <CustomText style={styles.caption}>{item.caption}</CustomText>
      <CustomText style={styles.price}>{item.price} | Free shipping</CustomText>
    </TouchableOpacity>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.profileImage }}
        style={styles.commentProfileImage}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <CustomText weight="bold" style={styles.commentUser}>{item.user}</CustomText>
          <CustomText style={styles.commentTimestamp}>{item.timestamp}</CustomText>
        </View>
        <CustomText style={styles.commentText}>{item.text}</CustomText>
        <View style={styles.commentActions}>
          <TouchableOpacity onPress={() => handleReply(item)}>
            <CustomText style={styles.commentActionText}>Reply</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReact(item)}>
            <CustomText style={styles.commentActionText}>React</CustomText>
          </TouchableOpacity>
          <TouchableOpacity>
            <CustomText style={styles.commentActionText}>•••</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageItem,
        item.user === 'Current User' ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      {item.product && (
        <View style={styles.productContainer}>
          <Image
            source={typeof item.product.image === 'string' ? { uri: item.product.image } : item.product.image}
            style={styles.productImage}
          />
          <CustomText style={styles.productCaption}>{item.product.caption}</CustomText>
        </View>
      )}
      <CustomText
        style={[
          styles.messageText,
          item.user === 'Current User' ? styles.sentMessageText : styles.receivedMessageText,
        ]}
      >
        {item.text}
      </CustomText>
      <CustomText style={styles.messageTimestamp}>{item.timestamp}</CustomText>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <Image
            source={sharayaLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          <CustomText weight="bold" style={styles.header}>Sharaya</CustomText>
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="menu" size={30} color="#B577CD" />
          </TouchableOpacity>
        </View>
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
      {/* Save to Collection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CustomText weight="bold" style={styles.modalTitle}>Save to Collection</CustomText>
            {collections.map((collection) => (
              <TouchableOpacity
                key={collection}
                style={styles.collectionItem}
                onPress={() => saveToCollection(collection)}
              >
                <CustomText style={styles.collectionText}>{collection}</CustomText>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.input}
              placeholder="New Collection Name"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <TouchableOpacity style={styles.createButton} onPress={createNewCollection}>
              <CustomText weight="bold" style={styles.createButtonText}>Create New Collection</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setNewCollectionName('');
              }}
            >
              <CustomText style={styles.cancelButtonText}>Cancel</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Comment Modal */}
      <Modal visible={commentModalVisible} transparent animationType="slide">
        <View style={styles.commentModalContainer}>
          <View style={styles.commentModalContent}>
            <View style={styles.commentModalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setCommentModalVisible(false);
                  setNewComment('');
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <CustomText weight="bold" style={styles.modalTitle}>Comments</CustomText>
              <View style={{ width: 24 }} />
            </View>
            <FlatList
              data={selectedPost?.comments || []}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentList}
              ListEmptyComponent={<CustomText style={styles.noComments}>No comments yet.</CustomText>}
            />
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={styles.commentSendButton} onPress={addComment}>
                <Ionicons name="send" size={20} color="#B577CD" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Message Modal */}
      <Modal visible={messageModalVisible} transparent animationType="slide">
        <View style={styles.messageModalContainer}>
          <View style={styles.messageModalContent}>
            <View style={styles.messageModalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setMessageModalVisible(false);
                  setNewMessage('');
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <CustomText weight="bold" style={styles.modalTitle}>
                Message {selectedPost?.username}
              </CustomText>
              <TouchableOpacity
                onPress={() => {
                  setMessageModalVisible(false);
                  setNewMessage('');
                  navigation.navigate('Chat', { username: selectedPost?.username, product: selectedPost });
                }}
              >
                <Ionicons name="chatbox-outline" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chatHistory[selectedPost?.username] || []}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              ListEmptyComponent={<CustomText style={styles.noMessages}>No messages yet.</CustomText>}
            />
            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity style={styles.messageSendButton} onPress={sendMessage}>
                <Ionicons name="send" size={20} color="#B577CD" />
              </TouchableOpacity>
            </View>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  logo: {
    width: 40,
    height: 40,
  },
  header: {
    fontSize: 24,
    color: '#B577CD',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  menuIcon: {
    padding: 5,
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
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 400,
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
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
  commentModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: '80%',
  },
  commentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  commentList: {
    flexGrow: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUser: {
    fontSize: 14,
    color: '#333',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  commentActions: {
    flexDirection: 'row',
  },
  commentActionText: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
  },
  noComments: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  commentInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  commentSendButton: {
    padding: 5,
  },
  messageModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    height: '80%',
  },
  messageModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  messageList: {
    flexGrow: 1,
  },
  messageItem: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#B577CD',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#333',
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productCaption: {
    fontSize: 14,
    color: '#333',
  },
  noMessages: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  messageSendButton: {
    padding: 5,
  },
});

export default Home;