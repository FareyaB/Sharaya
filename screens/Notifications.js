// screens/Notifications.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

// Hardcoded data for Updates and Messages
const updates = [
  { id: '1', title: 'Bollywood Wedding for you', subtitle: 'Check out this live event!', image: require('../assets/no1.png'), timestamp: '5h' },
  { id: '2', title: 'This could be your vibe', subtitle: 'A new collection you might like', image: require('../assets/no3.png'), timestamp: '18h' },
  { id: '3', title: 'Hijab Wedding Dress for you', subtitle: 'A perfect match for your style', image: require('../assets/no5.png'), timestamp: '1d' },
  { id: '4', title: 'You have a good eye', subtitle: 'Someone liked your review', image: require('../assets/no9.png'), timestamp: '1d' },
  { id: '5', title: 'Feels like your style', subtitle: 'New arrivals from Nameera', image: require('../assets/no1.png'), timestamp: '2d' },
  { id: '6', title: 'Inspired by you', subtitle: 'Custom designs just for you', image: require('../assets/no3.png'), timestamp: '2d' },
];

const messages = [
  { id: '1', pageName: 'Nameera by Farooq', username: 'nameerabyfarooq', lastMessage: 'You: Hey!', timestamp: '3:06 AM', profileImage: require('../assets/no1.png') },
  { id: '2', pageName: 'Nameera by Farooq', username: 'nameerabyfarooq', lastMessage: 'You: Hey!', timestamp: '3:06 AM', profileImage: require('../assets/no1.png') },
  { id: '3', pageName: 'Nameera by Farooq', username: 'nameerabyfarooq', lastMessage: 'You: Hey!', timestamp: '3:06 AM', profileImage: require('../assets/no1.png') },
  { id: '4', pageName: 'Nameera by Farooq', username: 'nameerabyfarooq', lastMessage: 'You: Hey!', timestamp: '3:06 AM', profileImage: require('../assets/no1.png') },
  { id: '5', pageName: 'Ana', username: '196MKJHG', lastMessage: 'Ana: Hi!', timestamp: 'Yesterday', profileImage: require('../assets/no3.png') },
];

const Notifications = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Messages'); // Default to Messages tab

  const renderUpdateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.updateItem}
      onPress={() => {
        // Navigate to a relevant screen (e.g., live stream or product details)
        // For now, we'll navigate to ProductDetails with a placeholder product
        navigation.navigate('ProductDetails', {
          product: {
            id: item.id,
            username: 'nameera',
            caption: item.title,
            price: '$500',
            postImage: item.image,
            profileImage: item.image,
            size: 'M',
            color: 'Red',
          },
        });
      }}
    >
      <Image source={item.image} style={styles.updateImage} />
      <View style={styles.updateTextContainer}>
        <Text style={styles.updateTitle}>{item.title}</Text>
        <Text style={styles.updateSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => {
        // Navigate to a chat screen (to be implemented)
        navigation.navigate('Chat', { pageName: item.pageName, username: item.username });
      }}
    >
      <Image source={item.profileImage} style={styles.messageImage} />
      <View style={styles.messageTextContainer}>
        <Text style={styles.pageName}>{item.pageName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Updates' && styles.activeTab]}
          onPress={() => setActiveTab('Updates')}
        >
          <Text style={[styles.tabText, activeTab === 'Updates' && styles.activeTabText]}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Messages' && styles.activeTab]}
          onPress={() => setActiveTab('Messages')}
        >
          <Text style={[styles.tabText, activeTab === 'Messages' && styles.activeTabText]}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'Updates' ? (
        <FlatList
          data={updates}
          renderItem={renderUpdateItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No updates available.</Text>}
        />
      ) : (
        <>
          {/* New Message Button */}
          <TouchableOpacity
            style={styles.newMessageButton}
            onPress={() => {
              // Navigate to a screen to start a new message (to be implemented)
              navigation.navigate('NewMessage');
            }}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
            <Text style={styles.newMessageText}>New message</Text>
          </TouchableOpacity>

          {/* Messages List */}
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No messages available.</Text>}
            ListHeaderComponent={<Text style={styles.sectionHeader}>Contacts</Text>}
          />
        </>
      )}

      <BottomNav navigation={navigation} activeRoute="Notifications" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  // Updates Section
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  updateImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  updateTextContainer: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  updateSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  // Messages Section
  newMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  newMessageText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageTextContainer: {
    flex: 1,
  },
  pageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});

export default Notifications;