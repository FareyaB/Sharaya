import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';

const Saved = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved</Text>
      <Text style={styles.placeholderText}>Saved screen to be implemented.</Text>
      <BottomNav navigation={navigation} activeRoute="Saved" />
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
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default Saved;