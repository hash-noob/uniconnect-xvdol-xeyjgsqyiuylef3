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
} from 'react-native';
import { Avatar, Card, Divider, IconButton, Surface, Text, useTheme, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StudentProfileScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    link: '',
  });
  const [projectErrors, setProjectErrors] = useState({});

  // Load projects from AsyncStorage on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedProjects = await AsyncStorage.getItem('studentProjects');
        if (storedProjects !== null) {
          setProjects(JSON.parse(storedProjects));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    
    loadProjects();
  }, []);

  // Save projects to AsyncStorage when they change
  useEffect(() => {
    const saveProjects = async () => {
      try {
        await AsyncStorage.setItem('studentProjects', JSON.stringify(projects));
      } catch (error) {
        console.error('Error saving projects:', error);
      }
    };
    
    if (projects.length > 0) {
      saveProjects();
    }
  }, [projects]);

  const profile = {
    name: "Hanok Erugurala",
    rollNumber: "21B81A05T2",
    avatar: "https://i.pravatar.cc/150?img=3",
    department: "B.Tech. Information Technology",
    semester: 7,
    cgpa: 7.5,
    academicYear: "2021 - 2025",
    dob: "5st Jan 2002",
    gender: "Male",
    contactNumber: "7981455290",
    email: "samrathreddy04@gmail.com",
    address: "Mangalpally, Hyderabad",
    branch: "Computer Science and Engineering",
    college: "CVR College of Engineering and Technology",
    courseDuration: "Sep 2021 - June 2025",
  };

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

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      console.log('Refreshing student data...');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handle "Add new" button press
  const handleAddNew = (section) => {
    console.log(`Add new ${section} pressed`);
    if (section === 'Projects') {
      setProjectModalVisible(true);
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
  const saveProject = () => {
    if (!validateProjectForm()) return;
    
    const projectToAdd = {
      ...newProject,
      id: Date.now().toString(), // Use timestamp as ID
      createdAt: new Date().toISOString(),
    };
    
    setProjects([projectToAdd, ...projects]);
    
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
  };

  // Delete project
  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
    
    // If no projects left, also update AsyncStorage
    if (updatedProjects.length === 0) {
      AsyncStorage.removeItem('studentProjects')
        .catch(error => console.error('Error removing projects from storage:', error));
    }
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
                source={{ uri: profile.avatar }} 
              />
            </View>
          </Animated.View>
          
          <View style={styles.profileHeaderInfo}>
            <Animated.Text style={[styles.userName, { fontSize: headerNameSize }]}>
              {profile.name}
            </Animated.Text>
            <Text style={styles.rollNumber}>{profile.rollNumber}</Text>

            {/* Additional info that fades out on scroll */}
            <Animated.View style={{ opacity: headerInfoOpacity }}>
              <Text style={styles.headerInfoText}>{profile.department}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.semester}</Text>
                  <Text style={styles.statLabel}>Semester</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.cgpa}</Text>
                  <Text style={styles.statLabel}>CGPA</Text>
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
              <Text style={styles.summaryLabel}>Semester</Text>
              <Text style={styles.summaryValue}>{profile.semester}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="trophy" size={24} color="#6a11cb" />
              <Text style={styles.summaryLabel}>CGPA</Text>
              <Text style={styles.summaryValue}>{profile.cgpa}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="calendar-range" size={24} color="#6a11cb" />
              <Text style={styles.summaryLabel}>Academic Year</Text>
              <Text style={styles.summaryValue}>{profile.academicYear}</Text>
            </View>
          </View>
        </Surface>

        {/* Personal Information */}
        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Personal Information" 
            left={(props) => <MaterialCommunityIcons name="account-details" size={24} color="#6a11cb" />}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{profile.dob}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <Text style={styles.infoValue}>{profile.gender}</Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="email" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <Text style={styles.infoLabel}>Phone</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="phone" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{profile.contactNumber}</Text>
            </View>
            <Text style={styles.infoLabel}>Address</Text>
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#6a11cb" />
              <Text style={styles.infoValue}>{profile.address}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Academic Information */}
        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Academic Information" 
            left={(props) => <MaterialCommunityIcons name="school" size={24} color="#6a11cb" />}
          />
          <Card.Content>
            <View style={styles.academicInfo}>
              <View style={styles.courseItem}>
                <Avatar.Icon size={48} icon="book" color="white" style={styles.courseIcon} />
                <View style={styles.courseDetails}>
                  <Text style={styles.courseTitle}>B.Tech {profile.branch}</Text>
                  <Text style={styles.courseSubtitle}>{profile.college}</Text>
                  <View style={styles.courseDurationContainer}>
                    <MaterialCommunityIcons name="calendar-range" size={16} color="#555" />
                    <Text style={styles.courseDuration}>{profile.courseDuration}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Projects Section */}
        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Projects" 
            left={(props) => <MaterialCommunityIcons name="file-document-edit" size={24} color="#6a11cb" />}
            right={(props) => (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddNew('Projects')}
              >
                <MaterialCommunityIcons name="plus-circle" size={20} color="#6a11cb" />
                <Text style={styles.addNewText}>Add</Text>
              </TouchableOpacity>
            )}
          />
          <Card.Content>
            {projects.length > 0 ? (
              <View>
                {projects.map((project) => (
                  <View key={project.id} style={styles.projectItem}>
                    <View style={styles.projectHeader}>
                      <View style={styles.projectTitleContainer}>
                        <MaterialCommunityIcons name="laptop" size={20} color="#6a11cb" />
                        <Text style={styles.projectTitle}>{project.title}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteProject(project.id)}>
                        <MaterialCommunityIcons name="delete" size={20} color="#FF5252" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.projectDescription}>{project.description}</Text>
                    <View style={styles.projectMeta}>
                      <Text style={styles.projectTech}>
                        <Text style={styles.projectMetaLabel}>Tech: </Text>
                        {project.technologies}
                      </Text>
                      {(project.startDate || project.endDate) && (
                        <Text style={styles.projectDate}>
                          <Text style={styles.projectMetaLabel}>Period: </Text>
                          {project.startDate}{project.endDate ? ` to ${project.endDate}` : ''}
                        </Text>
                      )}
                      {project.link && (
                        <View style={styles.projectLink}>
                          <MaterialCommunityIcons name="link" size={16} color="#2575fc" />
                          <Text style={styles.projectLinkText}>{project.link}</Text>
                        </View>
                      )}
                    </View>
                    <Divider style={styles.projectDivider} />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptySection}>
                <MaterialCommunityIcons name="information-outline" size={36} color="#aaa" />
                <Text style={styles.emptySectionText}>No projects added yet!</Text>
                <TouchableOpacity 
                  style={styles.addNowButton}
                  onPress={() => handleAddNew('Projects')}
                >
                  <Text style={styles.addNowText}>ADD NOW</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Additional Sections with Always Visible Add Components */}
        {[
          { name: 'Certifications', icon: 'certificate' },
          { name: 'Patents', icon: 'lightbulb' },
          { name: 'Extra Curricular Activities', icon: 'basketball' }
        ].map((section, index) => (
          <Card key={index} style={styles.sectionCard}>
            <Card.Title 
              title={section.name}
              left={(props) => <MaterialCommunityIcons name={section.icon} size={24} color="#6a11cb" />}
              right={(props) => (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => handleAddNew(section.name)}
                >
                  <MaterialCommunityIcons name="plus-circle" size={20} color="#6a11cb" />
                  <Text style={styles.addNewText}>Add</Text>
                </TouchableOpacity>
              )}
            />
            <Card.Content>
              <View style={styles.emptySection}>
                <MaterialCommunityIcons name="information-outline" size={36} color="#aaa" />
                <Text style={styles.emptySectionText}>No {section.name.toLowerCase()} added yet!</Text>
                <TouchableOpacity 
                  style={styles.addNowButton}
                  onPress={() => handleAddNew(section.name)}
                >
                  <Text style={styles.addNowText}>ADD NOW</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        {/* Extra space at bottom for comfortable scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Project Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={projectModalVisible}
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Project</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setProjectModalVisible(false)}
                />
              </View>
              
              <ScrollView style={styles.modalScrollView}>
                <TextInput
                  label="Project Title *"
                  value={newProject.title}
                  onChangeText={(text) => handleProjectInputChange('title', text)}
                  style={styles.modalInput}
                  mode="outlined"
                  error={!!projectErrors.title}
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
                  />
                  
                  <TextInput
                    label="End Date"
                    value={newProject.endDate}
                    onChangeText={(text) => handleProjectInputChange('endDate', text)}
                    style={[styles.modalInput, styles.dateInput]}
                    placeholder="MM/YYYY or Present"
                    mode="outlined"
                  />
                </View>
                
                <TextInput
                  label="Project Link"
                  value={newProject.link}
                  onChangeText={(text) => handleProjectInputChange('link', text)}
                  style={styles.modalInput}
                  placeholder="GitHub or project URL"
                  mode="outlined"
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  addNewText: {
    fontSize: 12,
    color: '#6a11cb',
    marginLeft: 3,
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
    marginLeft: 8,
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
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollView: {
    padding: 20,
  },
  modalInput: {
    marginBottom: 15,
    backgroundColor: 'white',
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
    marginTop: 10,
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
});

