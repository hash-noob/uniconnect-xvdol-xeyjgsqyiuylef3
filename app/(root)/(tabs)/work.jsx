import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WIDGETS = [
  {
    id: 1,
    title: 'Assignments',
    icon: 'book-edit',
    color: '#4CAF50',
    component: '@/components/faculty/Assignments',
  },
  {
    id: 2,
    title: 'Mentees',
    icon: 'account-group',
    color: '#2196F3',
    component: '@/components/faculty/Mentees',
  },
  {
    id: 3,
    title: 'My Attendance',
    icon: 'calendar-check',
    color: '#9C27B0',
    component: '@/components/faculty/FacultyAttendance',
  },
  {
    id: 4,
    title: 'Leave Request',
    icon: 'calendar-clock',
    color: '#FF9800',
    component: '@/components/faculty/LeaveRequest',
  },
  {
    id: 5,
    title: 'Class Schedule',
    icon: 'timetable',
    color: '#E91E63',
    component: '@/components/faculty/Schedule',
  },
  {
    id: 6,
    title: 'Mark Attendance',
    icon: 'clipboard-check',
    color: '#00BCD4',
    component: '@/components/faculty/MarkAttendance',
  },
  {
    id: 7,
    title: 'Results',
    icon: 'chart-box',
    color: '#795548',
    component: '@/components/faculty/Results',
  },
  {
    id: 8,
    title: 'Resources',
    icon: 'folder-multiple',
    color: '#607D8B',
    component: '@/components/faculty/Resources',
  },
];

export default function WorkScreen() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await SecureStore.getItemAsync('role');
      setUserRole(role);
    };
    fetchRole();
  }, []);

  const renderWidget = ({ id, title, icon, color, component }) => (
    <TouchableOpacity
      key={id}
      style={[styles.widget, { backgroundColor: color }]}
      onPress={() => {
        const screenName = component.split('/').pop(); // Get the component name
        router.push(`${screenName.toLowerCase()}`);
      }}
    >
      <MaterialCommunityIcons name={icon} size={32} color="white" />
      <Text style={styles.widgetText}>{title}</Text>
    </TouchableOpacity>
  );

  if (userRole === 'student') {
    return (
      <View style={styles.containerCenter}>
        <MaterialCommunityIcons 
          name="construction" 
          size={100} 
          color="#666"
        />
        <Text style={styles.developmentText}>Under Development</Text>
        <Text style={styles.subText}>This feature will be available soon!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.widgetGrid}>
          {WIDGETS.map(renderWidget)}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  widget: {
    width: (Dimensions.get('window').width - 48) / 2, // 2 columns with padding
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  widgetText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
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
