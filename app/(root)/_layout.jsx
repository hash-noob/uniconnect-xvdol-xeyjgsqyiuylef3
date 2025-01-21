import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack,router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useSession } from '@/hooks/session';


export default function RootLayout() {

  const {session,isLoading} = useSession()

 console.log(session,isLoading)
  if(!session){
       router.replace("/(root)/sign-in" )
   }

  // useEffect(() => {
  //   if (isLoading) {
  //   }
  // }, [isLoading]);

  // if (!isLoading) {
  //   return null;
  // }

  return (
      <Stack>
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        {/* //<Stack.Screen name="sign-in" options={{ headerShown: false }} /> */}
      </Stack>
  );
}
