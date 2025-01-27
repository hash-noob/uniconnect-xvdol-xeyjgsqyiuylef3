import { Link, Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Route() {
 return (
  <Redirect replace href='/(root)/(tabs)/(dashboard)' />
 );
}