import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, Animated } from 'react-native';

const backgroundImages = [
  'https://images.unsplash.com/photo-1603808033192-0c243029a2ec?w=150',
  'https://images.unsplash.com/photo-1603808033176-53e9e6fd7e62?w=150',
  'https://images.unsplash.com/photo-1603808033171-37e2c8d6e2b1?w=150',
  'https://images.unsplash.com/photo-1603808033185-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033199-37e2c8d6e2b1?w=150',
  'https://images.unsplash.com/photo-1603808033178-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033193-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033177-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033172-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033186-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033197-0e6f618d7e62?w=150',
  'https://images.unsplash.com/photo-1603808033187-0e6f618d7e62?w=150',
];

const Welcome = ({ navigation }) => {
  const logoScale = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 2,
      useNativeDriver: true,
    }).start();
  }, [logoScale]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {backgroundImages.map((image, index) => (
          <ImageBackground
            key={index}
            source={{ uri: image }}
            style={styles.gridImage}
            imageStyle={styles.gridImageStyle}
          />
        ))}
      </View>
      <View style={styles.overlay}>
        <Animated.Image
          source={require('../assets/sharaya-logo-modified.png')}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        />
        <Text style={styles.header}>Welcome to Sharaya</Text>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logInButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>
          By continuing, you agree to Sharaya's Terms of Service and acknowledge you've read our Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  gridImage: { width: 100, height: 100, margin: 5 },
  gridImageStyle: { borderRadius: 10 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 120, height: 120, marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  signUpButton: { backgroundColor: '#B577CD', paddingVertical: 15, paddingHorizontal: 100, borderRadius: 25, marginBottom: 15 },
  logInButton: { backgroundColor: '#E5E7EB', paddingVertical: 15, paddingHorizontal: 100, borderRadius: 25, marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  terms: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 },
});

export default Welcome;