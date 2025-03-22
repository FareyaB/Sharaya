// screens/Settings.js
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../components/CustomText';

const Settings = ({ navigation }) => {
  // State for profile editing
  const [name, setName] = useState('Fareya Borhan');
  const [username, setUsername] = useState('fareya_b');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // State for notification preferences
  const [messagesNotif, setMessagesNotif] = useState(true);
  const [likesNotif, setLikesNotif] = useState(true);
  const [newPostsNotif, setNewPostsNotif] = useState(false);

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          console.log('Clearing authentication data...');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText weight="bold" style={styles.headerTitle}>Settings</CustomText>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <CustomText weight="bold" style={styles.sectionTitle}>Profile</CustomText>
          {isEditingProfile ? (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <CustomText weight="bold" style={styles.saveButtonText}>Save</CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditingProfile(false)}
              >
                <CustomText style={styles.cancelButtonText}>Cancel</CustomText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.profileInfo}>
                <CustomText style={styles.profileLabel}>Name:</CustomText>
                <CustomText style={styles.profileValue}>{name}</CustomText>
              </View>
              <View style={styles.profileInfo}>
                <CustomText style={styles.profileLabel}>Username:</CustomText>
                <CustomText style={styles.profileValue}>{username}</CustomText>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingProfile(true)}
              >
                <CustomText style={styles.editButtonText}>Edit Profile</CustomText>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Notification Preferences Section */}
        <View style={styles.section}>
          <CustomText weight="bold" style={styles.sectionTitle}>Notifications</CustomText>
          <View style={styles.notificationItem}>
            <CustomText style={styles.notificationText}>Messages</CustomText>
            <Switch
              value={messagesNotif}
              onValueChange={setMessagesNotif}
              trackColor={{ false: '#ddd', true: '#B577CD' }}
              thumbColor={messagesNotif ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.notificationItem}>
            <CustomText style={styles.notificationText}>Likes</CustomText>
            <Switch
              value={likesNotif}
              onValueChange={setLikesNotif}
              trackColor={{ false: '#ddd', true: '#B577CD' }}
              thumbColor={likesNotif ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.notificationItem}>
            <CustomText style={styles.notificationText}>New Posts</CustomText>
            <Switch
              value={newPostsNotif}
              onValueChange={setNewPostsNotif}
              trackColor={{ false: '#ddd', true: '#B577CD' }}
              thumbColor={newPostsNotif ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Settings Section */}
        <View style={styles.section}>
          <CustomText weight="bold" style={styles.sectionTitle}>Privacy</CustomText>
          <TouchableOpacity
            style={styles.option}
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          >
            <CustomText style={styles.optionText}>Manage Privacy Settings</CustomText>
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <CustomText weight="bold" style={styles.logoutButtonText}>Logout</CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, // Increased for better spacing
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    marginLeft: 15, // Reduced to balance with increased header padding
  },
  content: {
    paddingHorizontal: 20, // Increased for more breathing room on the sides
    paddingVertical: 25, // Added vertical padding for top and bottom spacing
  },
  section: {
    marginBottom: 30, // Increased for more separation between sections
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15, // Increased for more space below the title
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15, // Increased for more vertical spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileLabel: {
    fontSize: 16,
    color: '#666',
  },
  profileValue: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 12, // Increased for better touch target
    paddingHorizontal: 20, // Added for better button width
    alignItems: 'center',
    marginTop: 15, // Increased for more space above the button
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12, // Increased for better text input spacing
    marginVertical: 8, // Increased for more space between inputs
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 12, // Increased for better touch target
    paddingHorizontal: 20, // Added for better button width
    alignItems: 'center',
    marginTop: 15, // Increased for more space above the button
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 12, // Increased for better touch target
    paddingHorizontal: 20, // Added for better button width
    alignItems: 'center',
    marginTop: 10, // Increased for more space above the button
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#B577CD',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15, // Increased for more vertical spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
  option: {
    paddingVertical: 15, // Increased for more vertical spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#B577CD',
    borderRadius: 5,
    paddingVertical: 12, // Increased for better touch target
    paddingHorizontal: 20, // Added for better button width
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Settings;