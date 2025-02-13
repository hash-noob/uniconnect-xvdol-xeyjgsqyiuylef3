import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Redirect, SplashScreen, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, IconButton, Provider as PaperProvider } from 'react-native-paper';

import { useSession } from '@/hooks/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, isLoading, signOut } = useSession();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync('userProfile');
        if (storedUser) {
          setUserProfile(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  function CustomDrawerContent(props) {
    const handleLogout = async () => {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            signOut();
            console.log('User logged out');
            props.navigation.replace('sign-in');
          },
        },
      ]);
    };

    return (
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />

        {/* Profile Section */}
        {userProfile && (
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => router.push('/profile')}
          >
            <Avatar.Image
              size={60}
              source={{ uri: userProfile.avatar || 'https://i.pravatar.cc/150' }}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileRole}>{userProfile.role === 'faculty' ? 'Faculty' : 'Student'}</Text>
            </View>
          </TouchableOpacity>
        )}

        <DrawerItemList {...props} />

        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <PaperProvider>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerRight: () => (
            <IconButton
              icon={() => <Ionicons name="notifications-circle" size={32} color="white" />}
              onPress={() => router.push('/(root)/(tabs)/(dashboard)/notice')}
              style={{ marginRight: 10 }}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="menu"
              iconColor="white"
              size={28}
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          ),
          drawerStyle: {
            backgroundColor: '#1a1a1a',
            width: 240,
          },
          drawerActiveBackgroundColor: '#2196F3',
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#aaa',
          headerTintColor: '#fff',
        })}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Attendance',
            drawerInactiveBackgroundColor: '#1a1a1a',
          }}
        />
      </Drawer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    height: '100%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 8,
  },
  profileText: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 14,
    color: '#bbb',
  },
  logoutContainer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
