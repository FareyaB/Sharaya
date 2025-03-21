// components/BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = ({ navigation, activeRoute }) => {
  const navItems = [
    { name: 'Home', icon: 'home', route: 'Home' },
    { name: 'Search', icon: 'search', route: 'Search' },
    { name: 'Cart', icon: 'cart', route: 'Cart' },
    { name: 'Notifications', icon: 'chatbubble-outline', route: 'Notifications' }, // Changed icon to messaging
    { name: 'Account', icon: 'person', route: 'Account' },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <View style={styles.navBar}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={activeRoute === item.route ? '#B577CD' : '#333'}
            />
            <Text
              style={[
                styles.navText,
                { color: activeRoute === item.route ? '#B577CD' : '#333' },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default BottomNav;