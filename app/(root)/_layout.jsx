import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { View,TouchableOpacity,Text,StyleSheet } from 'react-native';
import { Redirect,SplashScreen } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert } from 'react-native';

import { useSession } from '@/hooks/session';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const {session,isLoading,signOut} = useSession()

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);
 

  if (isLoading) {
    return null;
  }

  if(!session){
    return <Redirect href='/sign-in' />
  }

  function CustomDrawerContent(props){
    const handleLogout = async () => {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear auth tokens or perform logout actions
            signOut()
            console.log('User logged out');
            props.navigation.replace('sign-in'); // Redirect to login screen
          },
        },
      ]);
    };
  
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent} >
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
          <Drawer screenOptions={{
                                headerStyle:{
                                    backgroundColor : '#1a1a1a'
                                },
                                drawerStyle: {
                                    backgroundColor: '#1a1a1a', // Set drawer background color
                                    width: 240,
                                  },
                                  drawerActiveBackgroundColor: '#2196F3', 
                                  drawerActiveTintColor: '#fff', 
                                  drawerInactiveTintColor: '#aaa', 
                                  headerTintColor : '#fff'
                                }}
                 drawerContent={ (props)=> <CustomDrawerContent {...props}/> }
          >
          <Drawer.Screen
            name="(tabs)" 
            options={{
              drawerLabel: 'Home',
              title: 'Attendance',
              drawerInactiveBackgroundColor:'#1a1a1a',
              headerRight: ()=> <Ionicons name="notifications-circle" size={45} color="white" />
            }}
          />
        </Drawer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
 
  drawerContent: {
    flex : 1,
    height : '100%'
  },
  logoutContainer: {
    marginTop: 'auto', // Push the logout button to the bottom
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