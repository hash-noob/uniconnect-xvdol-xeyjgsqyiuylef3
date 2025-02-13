import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AssignmentsScreen() {
  return (
    <View style={styles.containerCenter}>
      <MaterialCommunityIcons 
        name="construction" 
        size={100} 
        color="#666"
      />
      <Text style={styles.developmentText}>Under Development</Text>
      <Text style={styles.subText}>Assignment management coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  developmentText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});