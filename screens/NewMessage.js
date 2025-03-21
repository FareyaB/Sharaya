// screens/NewMessage.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const NewMessage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>New Message</Text>
      <Text style={styles.placeholder}>New message functionality to be implemented.</Text>
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

export default NewMessage;