import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState, useEffect } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Avatar, Card, Divider, IconButton, Surface, Text, useTheme, TextInput, Button, Menu, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getPatents,
  addPatent,
  updatePatent,
  deletePatent,
  getActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  getStudentProfile
} from '../../api/profileService';

export default function StudentProfileScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY] = useState(new Animated.Value(0));
  const [profile, setProfile] = useState(null);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    link: '',
  });
  const [projectErrors, setProjectErrors] = useState({});

  const [certificationModalVisible, setCertificationModalVisible] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [editingCertification, setEditingCertification] = useState(null);
  const [newCertification, setNewCertification] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialID: '',
    credentialURL: '',
  });
  const [certificationErrors, setCertificationErrors] = useState({});

  const [patentModalVisible, setPatentModalVisible] = useState(false);
  const [patents, setPatents] = useState([]);
  const [editingPatent, setEditingPatent] = useState(null);
  const [newPatent, setNewPatent] = useState({
    title: '',
    applicationNumber: '',
    filingDate: '',
    status: 'Pending',
    description: '',
    inventors: '',
  });
  const [patentErrors, setPatentErrors] = useState({});
  const patentStatusOptions = ['Pending', 'Filed', 'Published', 'Granted', 'Rejected'];
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [statusPosition, setStatusPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [activities, setActivities] = useState([]);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    role: '',
    organization: '',
    startDate: '',
    endDate: '',
  });
  const [activityErrors, setActivityErrors] = useState({});

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Function to load all data from API
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadProfile(),
        loadProjects(),
        loadCertifications(),
        loadPatents(),
        loadActivities()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load profile data from API
  const loadProfile = async () => {
    try {
      const data = await getStudentProfile();
      //console.log("Loaded profile data:", data);
      setProfile(data);
      
      // Update projects, certifications, etc. with data from profile
      if (data.projects) setProjects(data.projects);
      if (data.certifications) setCertifications(data.certifications);
      if (data.patents) setPatents(data.patents);
      if (data.activities) setActivities(data.activities);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Load projects from API
  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to local storage if API fails
      try {
        const storedProjects = await AsyncStorage.getItem('studentProjects');
        if (storedProjects !== null) {
          setProjects(JSON.parse(storedProjects));
        }
      } catch (localError) {
        console.error('Error loading projects from local storage:', localError);
      }
    }
  };

  // Load certifications from API
  const loadCertifications = async () => {
    try {
      const data = await getCertifications();
      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
      // Fallback to local storage if API fails
      try {
        const storedCertifications = await AsyncStorage.getItem('studentCertifications');
        if (storedCertifications !== null) {
          setCertifications(JSON.parse(storedCertifications));
        }
      } catch (localError) {
        console.error('Error loading certifications from local storage:', localError);
      }
    }
  };

  // Load patents from API
  const loadPatents = async () => {
    try {
      const data = await getPatents();
      setPatents(data || []);
    } catch (error) {
      console.error('Error loading patents:', error);
      // Fallback to local storage if API fails
      try {
        const storedPatents = await AsyncStorage.getItem('studentPatents');
        if (storedPatents !== null) {
          setPatents(JSON.parse(storedPatents));
        }
      } catch (localError) {
        console.error('Error loading patents from local storage:', localError);
      }
    }
  };

  // Load activities from API
  const loadActivities = async () => {
    try {
      const data = await getActivities();
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      // Fallback to local storage if API fails
      try {
        const storedActivities = await AsyncStorage.getItem('studentActivities');
        if (storedActivities !== null) {
          setActivities(JSON.parse(storedActivities));
        }
      } catch (localError) {
        console.error('Error loading activities from local storage:', localError);
      }
    }
  };

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAllData();
    } catch (error) {
      console.error('Error refreshing:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Animation values for header
  const avatarScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [180, 80],
    extrapolate: 'clamp',
  });

  const headerPadding = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [15, 10],
    extrapolate: 'clamp',
  });

  const headerNameSize = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [24, 18],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 75, 150],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const headerInfoOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Handle "Add new" button press
  const handleAddNew = (section) => {
    console.log(`Add new ${section} pressed`);
    if (section === 'Projects') {
      setEditingProject(null);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        startDate: '',
        endDate: '',
        link: '',
      });
      setProjectModalVisible(true);
    } else if (section === 'Certifications') {
      setEditingCertification(null);
      setNewCertification({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialID: '',
        credentialURL: '',
      });
      setCertificationModalVisible(true);
    } else if (section === 'Patents') {
      setEditingPatent(null);
      setNewPatent({
        title: '',
        applicationNumber: '',
        filingDate: '',
        status: 'Pending',
        description: '',
        inventors: '',
      });
      setPatentModalVisible(true);
    } else if (section === 'Extra Curricular Activities') {
      setEditingActivity(null);
      setNewActivity({
        title: '',
        description: '',
        role: '',
        organization: '',
        startDate: '',
        endDate: '',
      });
      setActivityModalVisible(true);
    }
  };

  // Handle project input changes
  const handleProjectInputChange = (field, value) => {
    setNewProject({
      ...newProject,
      [field]: value,
    });
    
    // Clear error when user types
    if (projectErrors[field]) {
      setProjectErrors({
        ...projectErrors,
        [field]: null,
      });
    }
  };

  // Validate project form
  const validateProjectForm = () => {
    const errors = {};
    if (!newProject.title.trim()) errors.title = 'Title is required';
    if (!newProject.description.trim()) errors.description = 'Description is required';
    if (!newProject.technologies.trim()) errors.technologies = 'Technologies are required';
    
    setProjectErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save project
  const saveProject = async () => {
    if (!validateProjectForm()) return;
    
    try {
      let response;
      
      if (editingProject) {
        // Update existing project
        response = await updateProject(editingProject._id, newProject);
        
        // Update local state
        setProjects(projects.map(p => 
          p._id === editingProject._id ? response : p
        ));
      } else {
        // Add new project
        console.log("Adding new project:", newProject)
        response = await addProject(newProject);
        
        // Update local state
        setProjects([response, ...projects]);
      }
      
      // Reset form and close modal
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        startDate: '',
        endDate: '',
        link: '',
      });
      setProjectModalVisible(false);
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save project. Please try again.');
    }
  };

  // Delete project
  const deleteProjectHandler = async (projectId) => {
    try {
      await deleteProject(projectId);
      
      // Update local state
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error', 'Failed to delete project. Please try again.');
    }
  };

  // Handle certification input changes
  const handleCertificationInputChange = (field, value) => {
    setNewCertification({
      ...newCertification,
      [field]: value,
    });
    
    // Clear error when user types
    if (certificationErrors[field]) {
      setCertificationErrors({
        ...certificationErrors,
        [field]: null,
      });
    }
  };

  // Validate certification form
  const validateCertificationForm = () => {
    const errors = {};
    if (!newCertification.title.trim()) errors.title = 'Title is required';
    if (!newCertification.issuer.trim()) errors.issuer = 'Issuing organization is required';
    if (!newCertification.issueDate.trim()) errors.issueDate = 'Issue date is required';
    
    setCertificationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save certification
  const saveCertification = async () => {
    if (!validateCertificationForm()) return;
    
    try {
      let response;
      
      if (editingCertification) {
        // Update existing certification
        response = await updateCertification(editingCertification._id, newCertification);
        
        // Update local state
        setCertifications(certifications.map(c => 
          c._id === editingCertification._id ? response : c
        ));
      } else {
        // Add new certification
        response = await addCertification(newCertification);
        
        // Update local state
        setCertifications([response, ...certifications]);
      }
      
      // Reset form and close modal
      setNewCertification({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialID: '',
        credentialURL: '',
      });
      setCertificationModalVisible(false);
    } catch (error) {
      console.error('Error saving certification:', error);
      Alert.alert('Error', 'Failed to save certification. Please try again.');
    }
  };

  // Delete certification
  const deleteCertificationHandler = async (certificationId) => {
    try {
      await deleteCertification(certificationId);
      
      // Update local state
      setCertifications(certifications.filter(c => c._id !== certificationId));
    } catch (error) {
      console.error('Error deleting certification:', error);
      Alert.alert('Error', 'Failed to delete certification. Please try again.');
    }
  };

  // Measure dropdown position
  const measureStatusDropdown = (event) => {
    if (!event || !event.nativeEvent) return;
    const { x, y, width, height } = event.nativeEvent.layout;
    // Add offset to position the menu better
    setStatusPosition({ 
      x, 
      y: y + height + 5, 
      width, 
      height 
    });
  };

  // Toggle status menu visibility
  const toggleStatusMenu = (event) => {
    measureStatusDropdown(event);
    setStatusMenuVisible(!statusMenuVisible);
  };

  // Handle patent input changes
  const handlePatentInputChange = (field, value) => {
    setNewPatent({
      ...newPatent,
      [field]: value,
    });
    
    // Clear error when user types
    if (patentErrors[field]) {
      setPatentErrors({
        ...patentErrors,
        [field]: null,
      });
    }
  };

  // Validate patent form
  const validatePatentForm = () => {
    const errors = {};
    if (!newPatent.title.trim()) errors.title = 'Title is required';
    if (!newPatent.applicationNumber.trim()) errors.applicationNumber = 'Application number is required';
    if (!newPatent.filingDate.trim()) errors.filingDate = 'Filing date is required';
    if (!newPatent.status.trim()) errors.status = 'Status is required';
    
    setPatentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save patent
  const savePatent = async () => {
    if (!validatePatentForm()) return;
    
    try {
      let response;
      
      if (editingPatent) {
        // Update existing patent
        response = await updatePatent(editingPatent._id, newPatent);
        
        // Update local state
        setPatents(patents.map(p => 
          p._id === editingPatent._id ? response : p
        ));
      } else {
        // Add new patent
        response = await addPatent(newPatent);
        
        // Update local state
        setPatents([response, ...patents]);
      }
      
      // Reset form and close modal
      setNewPatent({
        title: '',
        applicationNumber: '',
        filingDate: '',
        status: 'Pending',
        description: '',
        inventors: '',
      });
      setPatentModalVisible(false);
    } catch (error) {
      console.error('Error saving patent:', error);
      Alert.alert('Error', 'Failed to save patent. Please try again.');
    }
  };

  // Delete patent
  const deletePatentHandler = async (patentId) => {
    try {
      await deletePatent(patentId);
      
      // Update local state
      setPatents(patents.filter(p => p._id !== patentId));
    } catch (error) {
      console.error('Error deleting patent:', error);
      Alert.alert('Error', 'Failed to delete patent. Please try again.');
    }
  };

  // Handle activity input changes
  const handleActivityInputChange = (field, value) => {
    setNewActivity({
      ...newActivity,
      [field]: value,
    });
    
    // Clear error when user types
    if (activityErrors[field]) {
      setActivityErrors({
        ...activityErrors,
        [field]: null,
      });
    }
  };

  // Validate activity form
  const validateActivityForm = () => {
    const errors = {};
    if (!newActivity.title.trim()) errors.title = 'Title is required';
    if (!newActivity.description.trim()) errors.description = 'Description is required';
    if (!newActivity.role.trim()) errors.role = 'Role is required';
    
    setActivityErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save activity
  const saveActivity = async () => {
    if (!validateActivityForm()) return;
    
    try {
      let response;
      
      if (editingActivity) {
        // Update existing activity
        response = await updateActivity(editingActivity._id, newActivity);
        
        // Update local state
        setActivities(activities.map(a => 
          a._id === editingActivity._id ? response : a
        ));
      } else {
        // Add new activity
        response = await addActivity(newActivity);
        
        // Update local state
        setActivities([response, ...activities]);
      }
      
      // Reset form and close modal
      setNewActivity({
        title: '',
        description: '',
        role: '',
        organization: '',
        startDate: '',
        endDate: '',
      });
      setActivityModalVisible(false);
    } catch (error) {
      console.error('Error saving activity:', error);
      Alert.alert('Error', 'Failed to save activity. Please try again.');
    }
  };

  // Delete activity
  const deleteActivityHandler = async (activityId) => {
    try {
      await deleteActivity(activityId);
      
      // Update local state
      setActivities(activities.filter(a => a._id !== activityId));
    } catch (error) {
      console.error('Error deleting activity:', error);
      Alert.alert('Error', 'Failed to delete activity. Please try again.');
    }
  };

  // Handler functions for UI
  const handleAddProject = () => {
    setEditingProject(null);
    setNewProject({
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      link: '',
    });
    setProjectModalVisible(true);
  };

  const handleEditProject = (project, index) => {
    // Set the project data to edit
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      link: project.link || '',
    });
    setProjectModalVisible(true);
  };

  const handleDeleteProject = (project) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteProjectHandler(project._id) }
      ]
    );
  };

  const handleAddCertification = () => {
    setEditingCertification(null);
    setNewCertification({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialID: '',
      credentialURL: '',
    });
    setCertificationModalVisible(true);
  };

  const handleEditCertification = (certification, index) => {
    // Set the certification data to edit
    setEditingCertification(certification);
    setNewCertification({
      title: certification.title,
      issuer: certification.issuer,
      issueDate: certification.issueDate || '',
      expiryDate: certification.expiryDate || '',
      credentialID: certification.credentialID || '',
      credentialURL: certification.credentialURL || '',
    });
    setCertificationModalVisible(true);
  };

  const handleDeleteCertification = (certification) => {
    Alert.alert(
      'Delete Certification',
      'Are you sure you want to delete this certification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCertificationHandler(certification._id) }
      ]
    );
  };

  const handleAddPatent = () => {
    setEditingPatent(null);
    setNewPatent({
      title: '',
      applicationNumber: '',
      filingDate: '',
      status: 'Pending',
      description: '',
      inventors: '',
    });
    setPatentModalVisible(true);
  };

  const handleEditPatent = (patent, index) => {
    // Set the patent data to edit
    setEditingPatent(patent);
    setNewPatent({
      title: patent.title,
      applicationNumber: patent.applicationNumber || '',
      filingDate: patent.filingDate || '',
      status: patent.status || 'Pending',
      description: patent.description || '',
      inventors: patent.inventors || '',
    });
    setPatentModalVisible(true);
  };

  const handleDeletePatent = (patent) => {
    Alert.alert(
      'Delete Patent',
      'Are you sure you want to delete this patent?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePatentHandler(patent._id) }
      ]
    );
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setNewActivity({
      title: '',
      description: '',
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
    });
    setActivityModalVisible(true);
  };

  const handleEditActivity = (activity, index) => {
    // Set the activity data to edit
    setEditingActivity(activity);
    setNewActivity({
      title: activity.title,
      description: activity.description || '',
      role: activity.role || '',
      organization: activity.organization || '',
      startDate: activity.startDate || '',
      endDate: activity.endDate || '',
    });
    setActivityModalVisible(true);
  };

  const handleDeleteActivity = (activity) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteActivityHandler(activity._id) }
      ]
    );
  };

  // Show loading indicator if data is loading
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  // Show error message if there was an error
  if (error && !refreshing) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadAllData} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // If profile data hasn't loaded yet, show a loading message
  if (!profile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  // Construct displayable profile data
  const displayProfile = {
    name: `${profile.first_name} ${profile.last_name}`,
    rollNumber: profile.roll_number || "N/A",
    avatar: "data:image/jpeg;base64,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*AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z", // Default avatar
    department: `${profile.course} ${profile.branch}`,
    semester: profile.semester || (profile.year ? parseInt(profile.year) * 2 : "N/A"),
    year: profile.year || "N/A",
    section: profile.section || "N/A",
    mentorId: profile.mentor_id || "N/A",
    contactNumber: profile.phoneNo || "N/A",
    email: profile.email || "N/A",
    address: profile.address || "N/A",
    branch: profile.branch || "N/A",
    college: profile.college || "N/A",
    mentorName: profile.mentorName || "N/A",
    mentorEmail: profile.mentorEmail || "N/A",
    // Additional fields from the backend
    fatherName: profile.fatherName || "N/A",
    fatherPhoneNo: profile.fatherPhoneNo || "N/A",
    attendance: profile.attendance_percentage ? `${profile.attendance_percentage.toFixed(2)}%` : "N/A",
    aadharNo: profile.aadharNo || "N/A",
    userId: profile.user_id || "N/A",
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated Header Background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          { height: headerHeight }
        ]}
      >
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.headerOverlay, { opacity: headerOpacity }]} />
      </Animated.View>

      {/* Header Content */}
      <Animated.View 
        style={[
          styles.header,
          { 
            height: headerHeight,
            paddingTop: headerPadding,
          }
        ]}
      >
        {/* Avatar and Name */}
        <View style={styles.profileHeader}>
          <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
            <View style={styles.avatarContainer}>
              <Avatar.Image 
                size={80} 
                source={{ uri: displayProfile.avatar }} 
              />
            </View>
          </Animated.View>
          
          <View style={styles.profileHeaderInfo}>
            <Animated.Text style={[styles.userName, { fontSize: headerNameSize }]}>
              {displayProfile.name}
            </Animated.Text>
            <Text style={styles.rollNumber}>{displayProfile.rollNumber}</Text>

            {/* Additional info that fades out on scroll */}
            <Animated.View style={{ opacity: headerInfoOpacity }}>
              <Text style={styles.headerInfoText}>{displayProfile.department}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{displayProfile.semester}</Text>
                  <Text style={styles.statLabel}>Semester</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{displayProfile.attendance}</Text>
                  <Text style={styles.statLabel}>Attendance</Text>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2575fc']}
            tintColor="#2575fc"
            progressBackgroundColor="#ffffff"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Academic Info Summary */}
        <Surface style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="school" size={24} color="#6a11cb" />
              <Text style={styles.summaryLabel}>Year</Text>
              <Text style={styles.summaryValue}>{displayProfile.year}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#6a11cb" />
              <Text style={styles.summaryLabel}>Attendance</Text>
              <Text style={styles.summaryValue}>{displayProfile.attendance}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="alpha-s-circle" size={24} color="#6a11cb" />
              <Text style={styles.summaryLabel}>Section</Text>
              <Text style={styles.summaryValue}>{displayProfile.section}</Text>
            </View>
          </View>
        </Surface>

        {/* Personal Information */}
        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Personal Information" 
            titleStyle={styles.cardTitle}
            left={(props) => <MaterialCommunityIcons name="account-details" size={24} color="#6a11cb" />}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Father's Name</Text>
                <Text style={styles.infoValue}>{displayProfile.fatherName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Roll Number</Text>
                <Text style={styles.infoValue}>{displayProfile.rollNumber}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Aadhar Number</Text>
                <Text style={styles.infoValue}>{displayProfile.aadharNo}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Mentor</Text>
                <Text style={styles.infoValue}>{displayProfile.mentorName}</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="email" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{displayProfile.email}</Text>
            </View>
            <Text style={styles.infoLabel}>Phone</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="phone" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{displayProfile.contactNumber}</Text>
            </View>
            <Text style={styles.infoLabel}>Father's Phone</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="phone" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{displayProfile.fatherPhoneNo}</Text>
            </View>
            <Text style={styles.infoLabel}>Address</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{displayProfile.address}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Academic Information */}
        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Academic Information" 
            titleStyle={styles.cardTitle}
            left={(props) => <MaterialCommunityIcons name="school" size={24} color="#6a11cb" />}
          />
          <Card.Content>
            <View style={styles.academicInfo}>
              <View style={styles.courseItem}>
                <Avatar.Icon size={48} icon="book" color="white" style={styles.courseIcon} />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>{displayProfile.department}</Text>
                  <Text style={styles.courseSubtitle}>{displayProfile.college}</Text>
                  <View style={styles.courseDetailsRow}>
                    <View style={styles.courseDetailItem}>
                      <MaterialCommunityIcons name="alpha-s-circle" size={16} color="#555" />
                      <Text style={styles.courseDetail}>Section: {displayProfile.section}</Text>
                    </View>
                    <View style={styles.courseDetailItem}>
                      <MaterialCommunityIcons name="numeric" size={16} color="#555" />
                      <Text style={styles.courseDetail}>Year: {displayProfile.year}</Text>
                    </View>
                  </View>
                  <View style={styles.courseDetailsRow}>
                    <View style={styles.courseDetailItem}>
                      <MaterialCommunityIcons name="school-outline" size={16} color="#555" />
                      <Text style={styles.courseDetail}>Semester: {displayProfile.semester}</Text>
                    </View>
                    <View style={styles.courseDetailItem}>
                      <MaterialCommunityIcons name="account-tie" size={16} color="#555" />
                      <Text style={styles.courseDetail}>Mentor ID: {displayProfile.mentorName}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Projects Section */}
        <Card style={styles.profileCard}>
          <Card.Title 
            title="Projects" 
            titleStyle={styles.cardTitle}
            right={(props) => (
              <TouchableOpacity 
                style={styles.headerAddButton}
                onPress={handleAddProject}
              >
                <MaterialCommunityIcons name="plus-circle" size={24} color="#6a11cb" />
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            {projects.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {projects.map((project, index) => (
                  <View key={index} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View style={styles.cardItemTitleContainer}>
                        <Text style={styles.cardItemTitle}>{project.title}</Text>
                      </View>
                      <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleEditProject(project, index)}>
                          <MaterialIcons name="edit" size={20} color="#6a11cb" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteIcon} 
                          onPress={() => handleDeleteProject(project)}
                        >
                          <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cardItemText} numberOfLines={2}>{project.description}</Text>
                    <Text style={styles.cardItemText}>Technologies: {project.technologies}</Text>
                    {project.startDate && (
                      <Text style={styles.cardItemText}>
                        Date: {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyStateText}>No projects added yet.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Certifications Section */}
        <Card style={styles.profileCard}>
          <Card.Title 
            title="Certifications" 
            titleStyle={styles.cardTitle}
            right={(props) => (
              <TouchableOpacity 
                style={styles.headerAddButton}
                onPress={handleAddCertification}
              >
                <MaterialCommunityIcons name="plus-circle" size={24} color="#6a11cb" />
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            {certifications.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {certifications.map((certification, index) => (
                  <View key={index} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View style={styles.cardItemTitleContainer}>
                        <Text style={styles.cardItemTitle}>{certification.title}</Text>
                      </View>
                      <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleEditCertification(certification, index)}>
                          <MaterialIcons name="edit" size={20} color="#6a11cb" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteIcon} 
                          onPress={() => handleDeleteCertification(certification)}
                        >
                          <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cardItemText}>Issuer: {certification.issuer}</Text>
                    <Text style={styles.cardItemText}>Date: {certification.issueDate}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyStateText}>No certifications added yet.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Patents Section */}
        <Card style={styles.profileCard}>
          <Card.Title 
            title="Patents" 
            titleStyle={styles.cardTitle}
            right={(props) => (
              <TouchableOpacity 
                style={styles.headerAddButton}
                onPress={handleAddPatent}
              >
                <MaterialCommunityIcons name="plus-circle" size={24} color="#6a11cb" />
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            {patents.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {patents.map((patent, index) => (
                  <View key={index} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View style={styles.cardItemTitleContainer}>
                        <Text style={styles.cardItemTitle}>{patent.title}</Text>
                      </View>
                      <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleEditPatent(patent, index)}>
                          <MaterialIcons name="edit" size={20} color="#6a11cb" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteIcon} 
                          onPress={() => handleDeletePatent(patent)}
                        >
                          <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cardItemText}>Application #: {patent.applicationNumber}</Text>
                    <View style={styles.statusBadgeContainer}>
                      <Text style={styles.cardItemText}>Status: </Text>
                      <View style={[
                        styles.statusBadge,
                        { backgroundColor: 
                          patent.status === 'Granted' ? 'rgba(76, 175, 80, 0.1)' :
                          patent.status === 'Rejected' ? 'rgba(244, 67, 54, 0.1)' :
                          patent.status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(33, 150, 243, 0.1)'
                        }
                      ]}>
                        <Text style={[
                          styles.statusBadgeText,
                          { color: 
                            patent.status === 'Granted' ? '#4CAF50' :
                            patent.status === 'Rejected' ? '#F44336' :
                            patent.status === 'Pending' ? '#FFC107' : '#2196F3'
                          }
                        ]}>
                          {patent.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cardItemText}>Date: {patent.filingDate}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyStateText}>No patents added yet.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Activities Section */}
        <Card style={styles.profileCard}>
          <Card.Title 
            title="Activities" 
            titleStyle={styles.cardTitle}
            right={(props) => (
              <TouchableOpacity 
                style={styles.headerAddButton}
                onPress={handleAddActivity}
              >
                <MaterialCommunityIcons name="plus-circle" size={24} color="#6a11cb" />
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            {activities.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
                {activities.map((activity, index) => (
                  <View key={index} style={styles.cardItem}>
                    <View style={styles.cardItemHeader}>
                      <View style={styles.cardItemTitleContainer}>
                        <Text style={styles.cardItemTitle}>{activity.title}</Text>
                      </View>
                      <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleEditActivity(activity, index)}>
                          <MaterialIcons name="edit" size={20} color="#6a11cb" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteIcon} 
                          onPress={() => handleDeleteActivity(activity)}
                        >
                          <MaterialIcons name="delete" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text style={styles.cardItemText}>Role: {activity.role}</Text>
                    <Text style={styles.cardItemText}>Organization: {activity.organization}</Text>
                    <Text style={styles.cardItemText}>Date: {activity.startDate} - {activity.endDate || 'Present'}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyStateText}>No activities added yet.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Extra space at bottom for comfortable scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Project Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={projectModalVisible}
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.popupModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Project</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setProjectModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.requiredFieldNote}>
                  <Text style={styles.requiredFieldText}>Fields marked with </Text>
                  <Chip 
                    mode="flat" 
                    style={styles.requiredChip}
                    textStyle={styles.requiredChipText}
                  >
                    Required
                  </Chip>
                  <Text style={styles.requiredFieldText}> are mandatory</Text>
                </View>
                
                <TextInput
                  label="Project Title *"
                  value={newProject.title}
                  onChangeText={(text) => handleProjectInputChange('title', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!projectErrors.title}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {projectErrors.title && <Text style={styles.errorText}>{projectErrors.title}</Text>}
                
                <TextInput
                  label="Description *"
                  value={newProject.description}
                  onChangeText={(text) => handleProjectInputChange('description', text)}
                  style={styles.modalInput}
                  multiline
                  numberOfLines={3}
                  mode="outlined"
                  error={!!projectErrors.description}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {projectErrors.description && <Text style={styles.errorText}>{projectErrors.description}</Text>}
                
                <TextInput
                  label="Technologies Used *"
                  value={newProject.technologies}
                  onChangeText={(text) => handleProjectInputChange('technologies', text)}
                  style={styles.modalInput}
                  placeholder="e.g. React Native, Firebase, Node.js"
                  mode="outlined"
                  error={!!projectErrors.technologies}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {projectErrors.technologies && <Text style={styles.errorText}>{projectErrors.technologies}</Text>}
                
                <View style={styles.dateContainer}>
                  <TextInput
                    label="Start Date"
                    value={newProject.startDate}
                    onChangeText={(text) => handleProjectInputChange('startDate', text)}
                    style={[styles.modalInput, styles.dateInput]}
                    placeholder="MM/YYYY"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                  />
                  
                  <TextInput
                    label="End Date"
                    value={newProject.endDate}
                    onChangeText={(text) => handleProjectInputChange('endDate', text)}
                    style={[styles.modalInput, styles.dateInput]}
                    placeholder="MM/YYYY or Present"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                  />
                </View>
                
                <TextInput
                  label="Project Link"
                  value={newProject.link}
                  onChangeText={(text) => handleProjectInputChange('link', text)}
                  style={styles.modalInput}
                  placeholder="GitHub or project URL"
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setProjectModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={saveProject}
                    style={styles.saveButton}
                  >
                    Save Project
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Certification Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={certificationModalVisible}
        onRequestClose={() => setCertificationModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.popupModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Certification</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setCertificationModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.requiredFieldNote}>
                  <Text style={styles.requiredFieldText}>Fields marked with </Text>
                  <Chip 
                    mode="flat" 
                    style={styles.requiredChip}
                    textStyle={styles.requiredChipText}
                  >
                    Required
                  </Chip>
                  <Text style={styles.requiredFieldText}> are mandatory</Text>
                </View>
                
                <TextInput
                  label="Certification Title *"
                  value={newCertification.title}
                  onChangeText={(text) => handleCertificationInputChange('title', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!certificationErrors.title}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {certificationErrors.title && <Text style={styles.errorText}>{certificationErrors.title}</Text>}
                
                <TextInput
                  label="Issuing Organization *"
                  value={newCertification.issuer}
                  onChangeText={(text) => handleCertificationInputChange('issuer', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!certificationErrors.issuer}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {certificationErrors.issuer && <Text style={styles.errorText}>{certificationErrors.issuer}</Text>}
                
                <TextInput
                  label="Issue Date *"
                  value={newCertification.issueDate}
                  onChangeText={(text) => handleCertificationInputChange('issueDate', text)}
                  style={styles.modalInput}
                  placeholder="MM/YYYY"
                  mode="outlined"
                  error={!!certificationErrors.issueDate}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {certificationErrors.issueDate && <Text style={styles.errorText}>{certificationErrors.issueDate}</Text>}
                
                <TextInput
                  label="Expiry Date (if applicable)"
                  value={newCertification.expiryDate}
                  onChangeText={(text) => handleCertificationInputChange('expiryDate', text)}
                  style={styles.modalInput}
                  placeholder="MM/YYYY or No Expiry"
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <TextInput
                  label="Credential ID"
                  value={newCertification.credentialID}
                  onChangeText={(text) => handleCertificationInputChange('credentialID', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <TextInput
                  label="Credential URL"
                  value={newCertification.credentialURL}
                  onChangeText={(text) => handleCertificationInputChange('credentialURL', text)}
                  style={styles.modalInput}
                  placeholder="Verification URL"
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setCertificationModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={saveCertification}
                    style={styles.saveButton}
                  >
                    Save Certification
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Patent Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={patentModalVisible}
        onRequestClose={() => setPatentModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.popupModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Patent</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setPatentModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.requiredFieldNote}>
                  <Text style={styles.requiredFieldText}>Fields marked with </Text>
                  <Chip 
                    mode="flat" 
                    style={styles.requiredChip}
                    textStyle={styles.requiredChipText}
                  >
                    Required
                  </Chip>
                  <Text style={styles.requiredFieldText}> are mandatory</Text>
                </View>
                
                <TextInput
                  label="Patent Title *"
                  value={newPatent.title}
                  onChangeText={(text) => handlePatentInputChange('title', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!patentErrors.title}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {patentErrors.title && <Text style={styles.errorText}>{patentErrors.title}</Text>}
                
                <TextInput
                  label="Application Number *"
                  value={newPatent.applicationNumber}
                  onChangeText={(text) => handlePatentInputChange('applicationNumber', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!patentErrors.applicationNumber}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {patentErrors.applicationNumber && <Text style={styles.errorText}>{patentErrors.applicationNumber}</Text>}
                
                <TextInput
                  label="Filing Date *"
                  value={newPatent.filingDate}
                  onChangeText={(text) => handlePatentInputChange('filingDate', text)}
                  style={styles.modalInput}
                  placeholder="MM/YYYY"
                  mode="outlined"
                  error={!!patentErrors.filingDate}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {patentErrors.filingDate && <Text style={styles.errorText}>{patentErrors.filingDate}</Text>}
                
                <Text style={[styles.statusLabel, {marginTop: 10, marginBottom: 5}]}>Status *</Text>
                
                {/* Simplified patent status selector */}
                <View style={[styles.statusSelector, patentErrors.status ? styles.inputError : null]}>
                  {patentStatusOptions.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusOption,
                        newPatent.status === status && styles.selectedStatusOption,
                        newPatent.status === status && {
                          backgroundColor: 
                            status === 'Granted' ? 'rgba(76, 175, 80, 0.1)' :
                            status === 'Rejected' ? 'rgba(244, 67, 54, 0.1)' :
                            status === 'Pending' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(33, 150, 243, 0.1)'
                        }
                      ]}
                      onPress={() => handlePatentInputChange('status', status)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          newPatent.status === status && styles.selectedStatusOptionText,
                          {
                            color: 
                              status === 'Granted' ? '#4CAF50' :
                              status === 'Rejected' ? '#F44336' :
                              status === 'Pending' ? '#FFC107' : '#2196F3'
                          }
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {patentErrors.status && <Text style={styles.errorText}>{patentErrors.status}</Text>}
                
                <TextInput
                  label="Description"
                  value={newPatent.description}
                  onChangeText={(text) => handlePatentInputChange('description', text)}
                  style={styles.modalInput}
                  multiline
                  numberOfLines={3}
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <TextInput
                  label="Inventors"
                  value={newPatent.inventors}
                  onChangeText={(text) => handlePatentInputChange('inventors', text)}
                  style={styles.modalInput}
                  placeholder="Names of co-inventors (if any)"
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setPatentModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={savePatent}
                    style={styles.saveButton}
                  >
                    Save Patent
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Activity Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={activityModalVisible}
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.popupModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Activity</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setActivityModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <View style={styles.requiredFieldNote}>
                  <Text style={styles.requiredFieldText}>Fields marked with </Text>
                  <Chip 
                    mode="flat" 
                    style={styles.requiredChip}
                    textStyle={styles.requiredChipText}
                  >
                    Required
                  </Chip>
                  <Text style={styles.requiredFieldText}> are mandatory</Text>
                </View>
                
                <TextInput
                  label="Activity Title *"
                  value={newActivity.title}
                  onChangeText={(text) => handleActivityInputChange('title', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!activityErrors.title}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {activityErrors.title && <Text style={styles.errorText}>{activityErrors.title}</Text>}
                
                <TextInput
                  label="Description *"
                  value={newActivity.description}
                  onChangeText={(text) => handleActivityInputChange('description', text)}
                  style={styles.modalInput}
                  multiline
                  numberOfLines={3}
                  mode="outlined"
                  error={!!activityErrors.description}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {activityErrors.description && <Text style={styles.errorText}>{activityErrors.description}</Text>}
                
                <TextInput
                  label="Role *"
                  value={newActivity.role}
                  onChangeText={(text) => handleActivityInputChange('role', text)}
                  style={styles.modalInput}
                  placeholder="e.g., Team Lead, Volunteer, Organizer"
                  mode="outlined"
                  error={!!activityErrors.role}
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                {activityErrors.role && <Text style={styles.errorText}>{activityErrors.role}</Text>}
                
                <TextInput
                  label="Organization"
                  value={newActivity.organization}
                  onChangeText={(text) => handleActivityInputChange('organization', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                />
                
                <View style={styles.dateContainer}>
                  <TextInput
                    label="Start Date"
                    value={newActivity.startDate}
                    onChangeText={(text) => handleActivityInputChange('startDate', text)}
                    style={[styles.modalInput, styles.dateInput]}
                    placeholder="MM/YYYY"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                  />
                  
                  <TextInput
                    label="End Date"
                    value={newActivity.endDate}
                    onChangeText={(text) => handleActivityInputChange('endDate', text)}
                    style={[styles.modalInput, styles.dateInput]}
                    placeholder="MM/YYYY or Present"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#6a11cb', placeholder: '#777777' } }}
                  />
                </View>
                
                <View style={styles.modalActions}>
                  <Button 
                    mode="outlined" 
                    onPress={() => setActivityModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                  <Button 
                    mode="contained" 
                    onPress={saveActivity}
                    style={styles.saveButton}
                  >
                    Save Activity
                  </Button>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 2,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rollNumber: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 5,
  },
  headerInfoText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  statItem: {
    marginRight: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 5,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    paddingTop: 3,
  },
  statValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  scrollContent: {
    paddingTop: 190, // Space for the header - reduced
    padding: 15,
  },
  summaryCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 4,
    padding: 15,
    backgroundColor: 'white',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  sectionCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: 'white',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#ddd',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  courseIcon: {
    backgroundColor: '#6a11cb',
  },
  courseDetails: {
    marginLeft: 15,
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  courseDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  courseDuration: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 15,
    backgroundColor: '#6a11cb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  addButtonLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptySection: {
    alignItems: 'center',
    padding: 15,
  },
  emptySectionText: {
    color: '#666',
    marginVertical: 10,
  },
  addNowButton: {
    backgroundColor: '#6a11cb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 5,
  },
  addNowText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  // Project Items
  projectItem: {
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  projectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  projectDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  projectMeta: {
    marginBottom: 5,
  },
  projectMetaLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  projectTech: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  projectDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  projectLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectLinkText: {
    fontSize: 13,
    color: '#2575fc',
    marginLeft: 5,
  },
  projectDivider: {
    marginTop: 10,
    marginBottom: 15,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f9f8ff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  modalScrollView: {
    padding: 20,
  },
  modalInput: {
    marginBottom: 15,
    backgroundColor: 'white',
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 0.48,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    marginRight: 10,
    borderColor: '#6a11cb',
  },
  saveButton: {
    backgroundColor: '#6a11cb',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: '#FF5252',
  },
  requiredFieldNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
    backgroundColor: '#f9f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e0ff',
  },
  requiredFieldText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  requiredChip: {
    backgroundColor: '#6a11cb',
  },
  requiredChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 5,
  },
  statusOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedStatusOption: {
    borderColor: '#6a11cb',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedStatusOptionText: {
    fontWeight: 'bold',
  },
  horizontalScrollContent: {
    paddingVertical: 10,
  },
  cardItem: {
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 300,
    borderLeftWidth: 4,
    borderLeftColor: '#6a11cb',
  },
  cardItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardItemDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  cardItemMeta: {
    marginBottom: 5,
  },
  cardItemTech: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  cardItemDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  cardItemLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardItemLinkText: {
    fontSize: 13,
    color: '#2575fc',
    marginLeft: 5,
  },
  certificationItem: {
    marginBottom: 15,
  },
  certificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  certificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  certificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  certificationIssuer: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  certificationMeta: {
    marginBottom: 5,
  },
  certificationDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  certificationID: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  certificationLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certificationLinkText: {
    fontSize: 13,
    color: '#2575fc',
    marginLeft: 5,
  },
  certificationDivider: {
    marginTop: 10,
    marginBottom: 15,
  },
  patentItem: {
    marginBottom: 15,
  },
  patentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  patentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  patentDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  patentMeta: {
    marginBottom: 5,
  },
  patentApplicationNumber: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  patentFilingDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  patentStatus: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  patentInventors: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  patentDivider: {
    marginTop: 10,
    marginBottom: 15,
  },
  activityItem: {
    marginBottom: 15,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  activityMeta: {
    marginBottom: 5,
  },
  activityRole: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  activityOrganization: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  activityDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  activityDivider: {
    marginTop: 10,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    padding: 5,
  },
  cardItemText: {
    fontSize: 14,
    color: '#555',
  },
  emptyStateText: {
    color: '#666',
    marginVertical: 10,
  },
  profileCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: 'white',
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerAddButton: {
    padding: 8,
  },
  popupModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingBottom: 20,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Loading and error styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6a11cb',
    marginTop: 10,
  },
  courseDetailsRow: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  courseDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  courseDetail: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
});

