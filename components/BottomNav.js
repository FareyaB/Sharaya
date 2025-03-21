// components/BottomNav.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = ({ navigation, activeRoute }) => {
  const navItems = [
    { name: 'Home', icon: 'home', route: 'Home' },
    { name: 'Search', icon: 'search', route: 'Search' },
    { name: 'Cart', icon: 'cart', route: 'Cart' }, // Cart is in the middle (3rd position)
    { name: 'Updates', icon: 'chatbubble-outline', route: 'Notifications' },
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
              size={25} // Reduced from 30 to 20
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
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60, // Reduced from 70 to 60 to fit smaller icons and text
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingHorizontal: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10, // Reduced from 12 to 10 to fit smaller layout
    marginTop: 2,
  },
});

export default BottomNav;