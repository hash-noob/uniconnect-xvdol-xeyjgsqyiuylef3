import { url } from '@/constants/AppContants';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';

export default function FacultyProfileScreen() {
  console.log('faculty profile Screen Opened'); // Log for debugging

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyId, setFacultyId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [facultyProfile, setFacultyProfile] = useState({
    name: 'N/A',
    employeeId: 'Unknown',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Not Assigned',
    designation: 'Faculty',
    academicYear: 'N/A',
    contactNumber: 'N/A',
    email: 'N/A',
    office: 'N/A',
    coursesTaught: [], // ✅ Ensure it's always an array
  });

  // ✅ Fetch user ID from SecureStore (Runs Only Once)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userId = await SecureStore.getItemAsync('userId');
        if (userId) {
          console.log(`User ID fetched: ${userId}`);
          setFacultyId(userId);
        } else {
          setError('No user ID found');
        }
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setError('Error fetching user ID');
      }
    };

    fetchUserId();
  }, []); // ✅ Runs only once when component mounts

  // ✅ Fetch Faculty Profile (Runs only when facultyId is set)
  const fetchFacultyProfile = useCallback(async () => {
    if (!facultyId) return;

    try {
      const response = await axios.get(`${url}/api/faculty/profile/${facultyId}`);

      if (response.data.success) {
        const profileData = response.data.facultyProfile || {};

        // ✅ Ensure immutability by creating a NEW object
        setFacultyProfile((prevState) => ({
          ...prevState, // Preserve old state
          name: profileData.name ?? 'N/A',
          employeeId: profileData.employeeId ?? 'Unknown',
          avatar: profileData.avatar ?? 'https://i.pravatar.cc/150?img=8',
          department: profileData.department ?? 'Not Assigned',
          designation: profileData.designation ?? 'Faculty',
          academicYear: profileData.academicYear ?? 'N/A',
          contactNumber: profileData.contactNumber ?? 'N/A',
          email: profileData.email ?? 'N/A',
          office: profileData.office ?? 'N/A',
          coursesTaught: Array.isArray(profileData.coursesTaught) ? [...profileData.coursesTaught] : [], // ✅ Always create a new array
        }));
      } else {
        setError('Faculty profile not found');
      }
    } catch (err) {
      console.error('Error fetching faculty profile:', err);
      setError('An error occurred while fetching faculty profile');
    } finally {
      setLoading(false);
    }
  }, [facultyId]); // ✅ Runs only when facultyId changes

  // ✅ Call API only when facultyId is set
  useEffect(() => {
    if (facultyId) {
      fetchFacultyProfile();
      setLoading(false);
    }
  }, [facultyId]); // ✅ Runs only when facultyId is available

  // Add refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here
      // await fetchFacultyData();
      console.log('Refreshing faculty data...');
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const avatarStyle = {
    transform: [
      {
        scale: scrollY.interpolate({
          inputRange: [0, 150],
          outputRange: [1, 0.625], // 80 -> 50 converted to scale (50/80 = 0.625)
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [150, 80],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.profileContainer}>
          <Animated.View style={avatarStyle}>
            <Avatar.Image size={80} source={{ uri: facultyProfile.avatar }} />
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{facultyProfile.name}</Text>
            <Text style={styles.employeeId}>{facultyProfile.employeeId}</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollContainer}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']} // Android
            tintColor="#2196F3" // iOS
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <LinearGradient colors={['#A1C4FD', '#C2E9FB']} style={styles.detailsCard}>
          <Text style={styles.detailsText}>DEPARTMENT: {facultyProfile.department}</Text>
          <Text style={styles.detailsText}>DESIGNATION: {facultyProfile.designation}</Text>
          <Text style={styles.detailsText}>ACADEMIC YEAR: {facultyProfile.academicYear}</Text>
        </LinearGradient>

        <Card style={styles.sectionCard}>
          <Card.Title title="Contact Details" />
          <Card.Content>
            <Text style={styles.label}>Contact No:</Text>
            <Text style={styles.value}>{facultyProfile.contactNumber}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{facultyProfile.email}</Text>
            <Text style={styles.label}>Office Location:</Text>
            <Text style={styles.value}>{facultyProfile.office}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  employeeId: {
    fontSize: 14,
    color: 'gray',
  },
  scrollContainer: {
    marginTop: 150,
    padding: 16,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    color: '#333',
  },
  sectionCard: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
