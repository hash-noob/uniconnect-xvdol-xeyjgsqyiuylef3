import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch, ScrollView, RefreshControl } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function Settings() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('role');
        setUserRole(role);
      } catch (error) {
        console.error('Error getting user role:', error);
      }
    };
    getUserRole();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <List.Item
          title="Push Notifications"
          description="Receive alerts about important updates"
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          left={props => <MaterialCommunityIcons {...props} name="bell-outline" size={24} color="#000000" />}
          right={props => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.developmentTag}>In development</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                color="#000000"
              />
            </View>
          )}
        />
        <Divider />
        <List.Item
          title="Email Updates"
          description="Receive email updates about your account"
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          left={props => <MaterialCommunityIcons {...props} name="email-outline" size={24} color="#000000" />}
          right={props => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.developmentTag}>In development</Text>
              <Switch
                value={emailUpdates}
                onValueChange={setEmailUpdates}
                color="#000000"
              />
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <List.Item
          title="Dark Mode"
          description="Use dark theme throughout the app"
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          left={props => <MaterialCommunityIcons {...props} name="theme-light-dark" size={24} color="#000000" />}
          right={props => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.developmentTag}>In development</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color="#000000"
              />
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <List.Item
          title="Version"
          description="1.0.0"
          titleStyle={styles.itemTitle}
          descriptionStyle={styles.itemDescription}
          left={props => <MaterialCommunityIcons {...props} name="information-outline" size={24} color="#000000" />}
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          titleStyle={styles.itemTitle}
          left={props => <MaterialCommunityIcons {...props} name="file-document-outline" size={24} color="#000000" />}
          onPress={() => console.log('Terms of Service pressed')}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          titleStyle={styles.itemTitle}
          left={props => <MaterialCommunityIcons {...props} name="shield-outline" size={24} color="#000000" />}
          onPress={() => console.log('Privacy Policy pressed')}
        />
      </View>

      {userRole === 'faculty' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faculty Settings</Text>
          <List.Item
            title="Attendance Preferences"
            description="Configure attendance marking options"
            titleStyle={styles.itemTitle}
            descriptionStyle={styles.itemDescription}
            left={props => <MaterialCommunityIcons {...props} name="calendar-check" size={24} color="#000000" />}
            onPress={() => console.log('Attendance Preferences pressed')}
          />
        </View>
      )}

      {userRole === 'student' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Settings</Text>
          <List.Item
            title="Course Notifications"
            description="Get alerts about course updates"
            titleStyle={styles.itemTitle}
            descriptionStyle={styles.itemDescription}
            left={props => <MaterialCommunityIcons {...props} name="book-open-variant" size={24} color="#000000" />}
            onPress={() => console.log('Course Notifications pressed')}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: '#000000',
  },
  section: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  itemTitle: {
    color: '#000000',
    fontSize: 16,
  },
  itemDescription: {
    color: '#000000',
    fontSize: 14,
  },
  developmentTag: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
}); 