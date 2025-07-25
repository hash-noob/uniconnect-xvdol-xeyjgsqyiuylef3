import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown : false}} />
      <Stack.Screen name="markAttendance" options={{ headerShown : false}} />
      <Stack.Screen name="notice" options={{ headerShown : false}} />
    </Stack>
  );
}