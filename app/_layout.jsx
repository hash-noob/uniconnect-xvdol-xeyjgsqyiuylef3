import { Slot } from 'expo-router';
import { SessionProvider } from '@/hooks/session';

export default function Root() {
  console.log("hello from root")
  return (
    <SessionProvider>
     <Slot/>
    </SessionProvider>
  );
}
