import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Assignments() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('role');
        setUserRole(role);
        
        // If student, redirect to Work screen
        if (role === 'student') {
          setTimeout(() => {
            router.replace('/(root)/(tabs)/Work');
          }, 500);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setLoading(false);
      }
    };
    
    checkUserRole();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  if (userRole === 'faculty') {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Assignments</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#6C63FF" />
          <Text style={styles.title}>Faculty Assignment Management</Text>
          <Text style={styles.subtitle}>
            This section is under development. Soon you will be able to create assignments,
            review submissions, and provide feedback to students.
          </Text>
        </View>
      </View>
    );
  }
  
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 