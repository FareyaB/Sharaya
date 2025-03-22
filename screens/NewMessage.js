// screens/NewMessage.js
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';

// Mock list of businesses (in a real app, this would come from a backend)
const businesses = [
  {
    id: '1',
    username: 'Nameera by Farooq',
    profileImage: require('../assets/no2.png'),
  },
  {
    id: '2',
    username: 'Niya Collections',
    profileImage: require('../assets/no6.png'),
  },
  {
    id: '3',
    username: 'Khuti - A place to depend on',
    profileImage: require('../assets/no1.png'),
  },
  {
    id: '4',
    username: 'Sana’s Boutique',
    profileImage: require('../assets/no10.png'),
  },
  {
    id: '5',
    username: 'Zara Fashions',
    profileImage: require('../assets/no9.png'),
  },
];

const NewMessage = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);
  const [chatHistory, setChatHistory] = useState({});
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const chatHistoryString = await AsyncStorage.getItem('chatHistory');
        const history = chatHistoryString ? JSON.parse(chatHistoryString) : {};
        setChatHistory(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  // Filter businesses based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredBusinesses(businesses);
    } else {
      const filtered = businesses.filter((business) =>
        business.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  };

  // Select a business to view chat
  const selectBusiness = (business) => {
    setSelectedBusiness(business);
    setShowChat(true);
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      user: 'Current User',
      timestamp: new Date().toLocaleTimeString(),
      product: null, // No product since this is a new chat initiated from NewMessage
    };

    const updatedChatHistory = {
      ...chatHistory,
      [selectedBusiness.username]: [
        ...(chatHistory[selectedBusiness.username] || []),
        message,
      ],
    };

    setChatHistory(updatedChatHistory);
    setNewMessage('');

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedChatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const renderBusiness = ({ item }) => {
    const messages = chatHistory[item.username] || [];
    const lastMessage = messages[messages.length - 1];

    return (
      <TouchableOpacity
        style={styles.businessItem}
        onPress={() => selectBusiness(item)}
      >
        <Image
          source={item.profileImage}
          style={styles.businessImage}
        />
        <View style={styles.businessContent}>
          <CustomText weight="bold" style={styles.businessName}>{item.username}</CustomText>
          <CustomText style={styles.lastMessage} numberOfLines={1}>
            {lastMessage ? lastMessage.text : 'No messages yet.'}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

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
    <SafeAreaView style={styles.container}>
      {!showChat ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <CustomText weight="bold" style={styles.headerTitle}>New Message</CustomText>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a business..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <FlatList
            data={filteredBusinesses}
            renderItem={renderBusiness}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.businessList}
            ListEmptyComponent={<CustomText style={styles.noResults}>No businesses found.</CustomText>}
          />
        </>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <CustomText weight="bold" style={styles.headerTitle}>{selectedBusiness.username}</CustomText>
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat', { username: selectedBusiness.username, product: null })}
            >
              <Ionicons name="chatbox-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={chatHistory[selectedBusiness.username] || []}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            ListEmptyComponent={<CustomText style={styles.noMessages}>No messages yet.</CustomText>}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#B577CD" />
            </TouchableOpacity>
          </View>
        </>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  businessList: {
    padding: 10,
  },
  businessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  businessImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  businessContent: {
    flex: 1,
  },
  businessName: {
    fontSize: 16,
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noResults: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  messageList: {
    padding: 10,
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
  },
});

export default NewMessage;