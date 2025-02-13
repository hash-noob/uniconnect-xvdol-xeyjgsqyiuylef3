import FacultyProfileScreen from '@/components/FacultyProfile';
import StudentProfileScreen from '@/components/StudentProfile';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

export default function ProfileScreen() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh

  // Fetch role from Secure Store
  const fetchRole = async () => {
    try {
      setRefreshing(true);
      const storedUser = await SecureStore.getItemAsync('role');
      if (storedUser) {
        setUserRole(storedUser);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refresh animation
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchRole} />
      }
    >
      {userRole === 'faculty' ? <FacultyProfileScreen /> : <StudentProfileScreen />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
