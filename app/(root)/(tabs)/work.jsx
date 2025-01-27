import { usePathname } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


export default function SettingsScreen() {

  const path = usePathname()
  console.log(path)
  return (
    <View style={styles.container}>
      <Text>This is the WOrk Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
