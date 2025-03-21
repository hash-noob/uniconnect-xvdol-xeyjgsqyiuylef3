import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, SplashScreen, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {  IconButton, Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import StudentDrawerContent from '@/components/student/DrawerContent';
import FacultyDrawerContent from '@/components/faculty/DrawerContent';
import { useSession } from '@/hooks/session';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

// Custom drawer item component for better styling


// Menu category component


export default function RootLayout() {
  const { session, isLoading, signOut } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [activeScreen, setActiveScreen] = useState('home');

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


  

  return (
    <PaperProvider>
      <StatusBar/>
      <Drawer
        screenOptions={ ({ navigation }) => ({
          headerStyle: {
            backgroundColor: session.role == 'faculty' ?'#1a1a1a' :'#4158D0',
          },
          headerRight: () => (
            <IconButton
              icon={() => <Ionicons name="notifications" size={26} color="white" />}
              onPress={() => router.push('/(root)/(tabs)/(dashboard)/notice')}
              style={{ marginRight: 10 }}
            />
          ),
          headerLeft: () => (
            <IconButton
              icon="menu"
              iconColor="white"
              size={24}
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          ),
          drawerStyle: {
            backgroundColor: '#212130',
            width: 300,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
        drawerContent={ (props) => { return session.role === 'faculty' ? <FacultyDrawerContent {...props}  activeScreen={activeScreen} setActiveScreen={setActiveScreen} signOut={signOut} /> :<StudentDrawerContent {...props}  activeScreen={activeScreen} setActiveScreen={setActiveScreen} signOut={signOut}/>}}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Attendance',
          }}
        />
      </Drawer>
    </PaperProvider>
  );
}

