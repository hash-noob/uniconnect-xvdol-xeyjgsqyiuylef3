import { Redirect, Stack,router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useSession } from '@/hooks/session';

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const {session,isLoading} = useSession()

 
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);
 

  if (isLoading) {
    return null;
  }
  console.log(session,isLoading)
  if(!session){
    return <Redirect href='/sign-in' />
  }
  
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
