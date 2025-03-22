// screens/Chat.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';

const Chat = ({ route, navigation }) => {
  const { username, product } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Load chat history from AsyncStorage
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const chatHistoryString = await AsyncStorage.getItem('chatHistory');
        const chatHistory = chatHistoryString ? JSON.parse(chatHistoryString) : {};
        const userChats = chatHistory[username] || [];
        setMessages(userChats);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, [username]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage,
      user: 'Current User',
      timestamp: new Date().toLocaleTimeString(),
      product: product ? { caption: product.caption, image: product.postImage } : null,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setNewMessage('');

    // Save to AsyncStorage
    try {
      const chatHistoryString = await AsyncStorage.getItem('chatHistory');
      const chatHistory = chatHistoryString ? JSON.parse(chatHistoryString) : {};
      chatHistory[username] = updatedMessages;
      await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText weight="bold" style={styles.headerTitle}>{username}</CustomText>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
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
    </View>
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
  messageList: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
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

export default Chat;