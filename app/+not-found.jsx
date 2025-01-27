
import { View, Text,StyleSheet } from 'react-native';
import {usePathname} from 'expo-router';

export default function NotFoundScreen() {

  const location = usePathname() 
  return (
    <View>
        <Text >This screen doesn't exist.</Text>
        <Text>This is the path {location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
