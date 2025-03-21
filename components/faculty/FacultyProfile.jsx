import { url } from '@/constants/AppContants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Surface, Text } from 'react-native-paper';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200; // Reduced from 220
const HEADER_MIN_HEIGHT = 80; // Reduced from 90
const PROFILE_IMAGE_MAX_SIZE = 110; // Reduced from 120
const PROFILE_IMAGE_MIN_SIZE = 50; // Reduced from 60

export default function FacultyProfileScreen() {
  console.log('faculty profile Screen Opened'); // Log for debugging

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyId, setFacultyId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('about');
  
  const [facultyProfile, setFacultyProfile] = useState({
    name: 'N/A',
    employeeId: 'Unknown',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Not Assigned',
    designation: 'Faculty',
    academicYear: 'N/A',
    contactNumber: 'N/A',
    email: 'N/A',
    office: 'CVR College of Engineering',
    coursesTaught: [], // ✅ Ensure it's always an array
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // Reduced from 50

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
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600, // Faster animation
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600, // Faster animation
        useNativeDriver: true
      })
    ]).start();
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
  }, [facultyId, fetchFacultyProfile]); // ✅ Runs only when facultyId is available

  // Add refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (facultyId) {
        await fetchFacultyProfile();
      }
      console.log('Refreshing faculty data...');
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [facultyId, fetchFacultyProfile]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => facultyId && fetchFacultyProfile()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Animation values for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [70, 120],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const avatarSize = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [PROFILE_IMAGE_MAX_SIZE, PROFILE_IMAGE_MIN_SIZE],
    extrapolate: 'clamp',
  });

  const avatarMarginTop = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_SIZE/0.6 , 10], // Moved higher up (removed /1.7 factor)
    extrapolate: 'clamp',
  });

  const nameSize = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [22, 18],
    extrapolate: 'clamp',
  });

  const renderAboutTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Surface style={styles.infoCard}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="office-building" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{facultyProfile.department}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="badge-account-horizontal" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Designation</Text>
            <Text style={styles.infoValue}>{facultyProfile.designation}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
      
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="identifier" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Employee ID</Text>
            <Text style={styles.infoValue}>{facultyProfile.employeeId}</Text>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderContactTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Surface style={styles.infoCard}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{facultyProfile.contactNumber}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{facultyProfile.email}</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={22} color="#6200EE" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Office Location</Text>
            <Text style={styles.infoValue}>{facultyProfile.office}</Text>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderCoursesTab = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {facultyProfile.coursesTaught && facultyProfile.coursesTaught.length > 0 ? (
        facultyProfile.coursesTaught.map((course, index) => (
          <Surface key={index} style={styles.courseCard}>
            <Text style={styles.courseTitle}>{course.title || "Unknown Course"}</Text>
            <Text style={styles.courseCode}>{course.code || "No Code"}</Text>
            <View style={styles.courseDetails}>
              <View style={styles.courseStat}>
                <MaterialCommunityIcons name="account-group" size={18} color="#6200EE" />
                <Text style={styles.courseStatText}>{course.students || 0} Students</Text>
              </View>
              <View style={styles.courseStat}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#6200EE" />
                <Text style={styles.courseStatText}>{course.credits || 0} Credits</Text>
              </View>
            </View>
          </Surface>
        ))
      ) : (
        <Surface style={styles.emptyStateCard}>
          <MaterialCommunityIcons name="book-open-variant" size={48} color="#BEBEBE" />
          <Text style={styles.emptyStateText}>No courses currently assigned</Text>
        </Surface>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6200EE" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient 
          colors={['#6200EE', '#9D4EDD']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />
      </Animated.View>

      {/* Profile Section with Avatar */}
      <Animated.View style={[styles.profileContainer, { top: avatarMarginTop }]}>
        <Animated.View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
          <Image 
            source={{ uri: facultyProfile.avatar }} 
            style={styles.avatarImage} 
          />
        </Animated.View>
        
        <Animated.Text style={[styles.nameText, { fontSize: nameSize }]}>
          {facultyProfile.name}
        </Animated.Text>
        
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badgeGradient}
          >
            <Text style={styles.badgeText}>{facultyProfile.designation}</Text>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Main Content with Tabs */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6200EE']} // Android
            tintColor="#6200EE" // iOS
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Tab navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'about' && styles.activeTabButton]}
            onPress={() => setActiveTab('about')}
          >
            <MaterialCommunityIcons 
              name="account" 
              size={22} 
              color={activeTab === 'about' ? '#6200EE' : '#757575'} 
            />
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'contact' && styles.activeTabButton]}
            onPress={() => setActiveTab('contact')}
          >
            <MaterialCommunityIcons 
              name="contacts" 
              size={22} 
              color={activeTab === 'contact' ? '#6200EE' : '#757575'} 
            />
            <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>Contact</Text>
          </TouchableOpacity>
          
        </View>
                
        {/* Tab content - Immediate display without spacer */}
        <View style={styles.tabContentContainer}>
          {activeTab === 'about' && renderAboutTab()}
          {activeTab === 'contact' && renderContactTab()}
        </View>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  profileContainer: {
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    backgroundColor: 'white',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  nameText: {
    fontWeight: 'bold',
    marginTop: 8,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgeContainer: {
    marginTop: 4,
  },
  badgeGradient: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT + 30, // Reduced from 60 to move tabs higher
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: -10, // Add negative margin to move tabs up
    marginBottom: 15,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 25,
  },
  activeTabButton: {
    backgroundColor: '#f0e6ff',
  },
  tabText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  tabContentContainer: {
    marginHorizontal: 16,
  },
  tabContent: {
    padding: 0,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 6,
  },
  socialCard: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#424242',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    backgroundColor: '#f5f5f5',
  },
  courseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  courseCode: {
    fontSize: 14,
    color: '#6200EE',
    marginTop: 4,
  },
  courseDetails: {
    flexDirection: 'row',
    marginTop: 12,
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  courseStatText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#757575',
  },
  emptyStateCard: {
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
