// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Search from './screens/Search';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout'; // Import the Checkout screen
import ProductDetails from './screens/ProductDetails';
import Account from './screens/Account';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;