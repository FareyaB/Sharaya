// screens/Messages.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from '../components/CustomText';
import BottomNav from '../components/BottomNav';

const Messages = ({ navigation }) => {
  const [chatHistory, setChatHistory] = useState({});

  const loadChatHistory = async () => {
    try {
      const chatHistoryString = await AsyncStorage.getItem('chatHistory');
      const history = chatHistoryString ? JSON.parse(chatHistoryString) : {};
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  useEffect(() => {
    loadChatHistory();

    // Add a listener to reload chat history when the screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      loadChatHistory();
    });

    return unsubscribe;
  }, [navigation]);

  const renderChat = ({ item }) => {
    const username = item[0];
    const messages = item[1];
    const lastMessage = messages[messages.length - 1];

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { username, product: lastMessage?.product })}
      >
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }}
          style={styles.chatProfileImage}
        />
        <View style={styles.chatContent}>
          <CustomText weight="bold" style={styles.chatUsername}>{username}</CustomText>
          <CustomText style={styles.chatLastMessage} numberOfLines={1}>
            {lastMessage ? lastMessage.text : 'No messages yet.'}
          </CustomText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText weight="bold" style={styles.headerTitle}>Messages</CustomText>
      </View>
      <FlatList
        data={Object.entries(chatHistory)}
        renderItem={renderChat}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={<CustomText style={styles.noChats}>No messages yet.</CustomText>}
      />
      <TouchableOpacity
        style={styles.newMessageButton}
        onPress={() => navigation.navigate('NewMessage')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      <BottomNav navigation={navigation} activeRoute="Messages" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    color: '#333',
  },
  chatList: {
    padding: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatUsername: {
    fontSize: 16,
    color: '#333',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noChats: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#B577CD',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default Messages;