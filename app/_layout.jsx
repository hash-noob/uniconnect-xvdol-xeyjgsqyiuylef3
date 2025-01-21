import { Stack } from 'expo-router';
import { SessionProvider } from '@/hooks/session';

export default function Root() {
  console.log("hello from root")
  return (
    <SessionProvider>
       <Stack>
            <Stack.Screen name="(root)" options={{ headerShown : false}} />
            <Stack.Screen name="+not-found"/>
       </Stack>
    </SessionProvider>
  );
}
