import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Card, IconButton, Text } from 'react-native-paper';

export default function StudentProfileScreen() {
  {console.log('Student Profile Screen Opened')}
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0)); // Track scrolling

  const profile = {
    name: "John Doe",
    rollNumber: "210520201234",
    avatar: "https://i.pravatar.cc/150?img=3",
    department: "B.Tech. Information Technology",
    semester: 7,
    cgpa: 7.5,
    academicYear: "2020 - 2024",
    dob: "1st Jan 2002",
    gender: "Male",
    contactNumber: "123456790",
    email: "abc123@gmail.com",
    address: "12, abc street, defgh, jklm - 123456",
    branch: "Information Technology",
    college: "Department of Engineering",
    courseDuration: "Sep 2020 - June 2024",
  };

  // Replace avatarSize with avatarStyle
  const avatarStyle = {
    transform: [
      {
        scale: scrollY.interpolate({
          inputRange: [0, 150],
          outputRange: [1, 0.625], // 80 -> 50 converted to scale
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [150, 80], // Header shrinks
    extrapolate: 'clamp',
  });

  const profileTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -20], // Moves profile section up
    extrapolate: 'clamp',
  });

  const profileMarginLeft = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 20], // Moves profile info to left
    extrapolate: 'clamp',
  });

  // Add refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here
      // await fetchStudentData();
      console.log('Refreshing student data...');
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[
            styles.profileInfo,
            { transform: [{ translateY: profileTranslateY }], marginLeft: profileMarginLeft }
          ]}
        >
          <Animated.View style={avatarStyle}>
            <Avatar.Image size={80} source={{ uri: profile.avatar }} />
          </Animated.View>
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.rollNumber}>{profile.rollNumber}</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Scrollable Content */}
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
        {/* Department Card */}
        <LinearGradient colors={['#A1C4FD', '#C2E9FB']} style={styles.departmentCard}>
          <Text style={styles.departmentText}>DEPARTMENT : {profile.department}</Text>
          <Text style={styles.departmentText}>SEMESTER : {profile.semester}</Text>
          <Text style={styles.departmentText}>CURRENT CGPA : {profile.cgpa}</Text>
          <Text style={styles.departmentText}>ACADEMIC YEAR : {profile.academicYear}</Text>
        </LinearGradient>

        {/* Contact Details */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Contact Details" />
          <Card.Content>
            <Text style={styles.label}>Contact No</Text>
            <Text style={styles.value}>{profile.contactNumber}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile.address}</Text>
          </Card.Content>
        </Card>

        {/* Current / Ongoing Courses */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Current / Ongoing Courses" />
          <Card.Content>
            <View style={styles.courseItem}>
              <Avatar.Icon size={40} icon="book" color="white" style={styles.courseIcon} />
              <View>
                <Text style={styles.courseTitle}>B.Tech {profile.branch}</Text>
                <Text style={styles.courseSubtitle}>{profile.college}</Text>
                <Text style={styles.courseDuration}>📅 {profile.courseDuration}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Additional Sections */}
        {['Projects', 'Certifications', 'Patents', 'Extra Curricular Activities'].map((item, index) => (
          <Card key={index} style={styles.sectionCard}>
            <Card.Title
              title={item}
              right={() => (
                <TouchableOpacity style={styles.addButton}>
                  <IconButton icon="plus-circle" size={20} color="blue" />
                  <Text style={styles.addNewText}>Add new</Text>
                </TouchableOpacity>
              )}
            />
            <Card.Content>
              <Text>You have not added any yet!</Text>
            </Card.Content>
          </Card>
        ))}
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
    elevation: 3, // Adds shadow
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    color: 'black',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  rollNumber: {
    fontSize: 14,
    color: 'gray',
  },
  notificationIcon: {
    position: 'absolute',
    right: 16,
    top: 20,
  },
  scrollContainer: {
    marginTop: 150,
    padding: 16,
  },
  departmentCard: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },
  departmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    color: '#fff',
  },
  sectionCard: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3, // Adds shadow
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseIcon: {
    backgroundColor: '#3B82F6',
    marginRight: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  courseSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  courseDuration: {
    fontSize: 12,
    color: '#555',
  },
  addNewText: {
    fontSize: 12,
    color: 'blue',
    textAlign: 'center',
  },
});

