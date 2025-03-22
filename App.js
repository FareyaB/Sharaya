// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Account from './screens/Account';
import CollectionDetails from './screens/CollectionDetails';
import ProductDetails from './screens/ProductDetails';
import Settings from './screens/Settings';
import Chat from './screens/Chat';
import Notifications from './screens/Notifications';
import NewMessage from './screens/NewMessage';
import Cart from './screens/Cart'; // New import
import Search from './screens/Search'; // New import

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }}/>
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }}/>
      <Stack.Screen name="CollectionDetails" component={CollectionDetails} options={{ headerShown: false }}/>
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }}/>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }}/>
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }}/>
      <Stack.Screen name="NewMessage" component={NewMessage} options={{ headerShown: false }}/>
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }}/>
      <Stack.Screen name="Search" component={Search} options={{ headerShown: false }}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;