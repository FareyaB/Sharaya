// screens/Chat.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Chat = ({ route, navigation }) => {
  const { pageName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Chat with {pageName}</Text>
      <Text style={styles.placeholder}>Chat functionality to be implemented.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Chat;