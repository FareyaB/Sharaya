import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu, PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password) {
        alert('Please fill out all required fields (Name, Email, Password).');
        return;
      }
      const userData = { name, email, password, address, gender };
      console.log('Sign Up Data:', userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to AsyncStorage');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('An error occurred during sign-up. Please try again.');
    }
  };

  const openMenu = () => {
    console.log('Opening menu');
    setMenuVisible(true);
  };
  const closeMenu = () => {
    console.log('Closing menu');
    setMenuVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Sharaya</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
        <View style={styles.dropdownContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity style={styles.dropdown} onPress={openMenu}>
                <Text style={styles.dropdownText}>{gender || 'Select Gender'}</Text>
              </TouchableOpacity>
            }
            style={styles.menu}
          >
            <Menu.Item
              onPress={() => {
                setGender('');
                closeMenu();
              }}
              title="Select Gender"
              titleStyle={styles.menuItemPlaceholder}
            />
            <Menu.Item
              onPress={() => {
                setGender('Male');
                closeMenu();
              }}
              title="Male"
            />
            <Menu.Item
              onPress={() => {
                setGender('Female');
                closeMenu();
              }}
              title="Female"
            />
            <Menu.Item
              onPress={() => {
                setGender('Other');
                closeMenu();
              }}
              title="Other"
            />
          </Menu>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  dropdown: {
    padding: 10,
    height: 50,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#999',
  },
  menu: {
    width: '100%',
    maxHeight: 200,
  },
  menuItemPlaceholder: {
    color: '#999',
  },
  button: {
    backgroundColor: '#B577CD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#B577CD',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SignUp;