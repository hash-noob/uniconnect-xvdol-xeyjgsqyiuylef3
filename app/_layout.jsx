import { Slot } from 'expo-router';
import { SessionProvider } from '@/hooks/session';

export default function Root() {
  return (
    <SessionProvider>
     <Slot/>
    </SessionProvider>
  );
}
