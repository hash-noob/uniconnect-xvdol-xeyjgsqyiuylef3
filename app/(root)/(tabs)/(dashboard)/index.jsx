import { url } from '@/constants/AppContants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [state, setState] = useState({
    currentMonth: '',
    schedule: [],
    statistics: {
      total: 60, 
      present: 56,
      absent: 4,
    },
    loading: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const role = await SecureStore.getItemAsync('role');
      const userId = await SecureStore.getItemAsync('userId');
      setUserRole(role);
      if (role === 'faculty') {
        setFacultyId(userId);
      }
    };
    fetchUserData();
  }, []);

  const todayDate = new Date().toISOString().split('T')[0];
  const colors = ['#2196F3', '#4CAF50', '#9C27B0', '#FFC107', '#FF5722', '#00BCD4', '#FF9800', '#673AB7'];
  let usedColors = [];

  const getRandomColor = () => {
  // Reset usedColors if all colors are used
    if (usedColors.length === colors.length) {
      usedColors = [];
    }

    // Get a color that hasn't been used yet
    let color;
    do {
      color = colors[Math.floor(Math.random() * colors.length)];
    } while (usedColors.includes(color));

    // Add the color to usedColors and return it
    usedColors.push(color);
    return color;
  };

  useEffect(() => {
    if (userRole === 'faculty' && facultyId) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(`${url}/api/faculty/schedule/${facultyId}`);
          const weeklySchedule = response.data.schedule[0].weekly_schedule;
  
          const selectedDayName = new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
          });
  
          const daySchedule = weeklySchedule.find(day => day.day === selectedDayName);
  
          const formattedSchedule = daySchedule
            ? daySchedule.slots.map(slot => ({
                time: slot.time,
                subject: slot.subject_id,
                duration: slot.duration,
                color: getRandomColor(),
              }))
            : [];
  
          setFilteredSchedule(formattedSchedule);
          setState(state => ({
            ...state,
            schedule: formattedSchedule,
            loading: false,
          }));
        } catch (error) {
          console.error('Error fetching schedule:', error);
          setFilteredSchedule([]);
          setState(state => ({
            ...state,
            schedule: [],
            loading: false,
          }));
        }
      };
  
      fetchSchedule();
    }
  }, [selectedDate, facultyId, userRole]);

  const convertTo24Hour = time => {
    const [hours, minutes, period] = time.match(/(\d+):?(\d+)?\s?(AM|PM)/i).slice(1);
    let hour = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
    for (let i = -4; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      // Correctly format `fullDate` as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${day}`;
  
      dates.push({
        day: days[date.getDay()], 
        date: date.getDate(), 
        fullDate, 
        isToday: i === 0, 
      });
    }
    return dates;
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const role = await SecureStore.getItemAsync('role');
      setUserRole(role);
      if (role === 'faculty') {
        const userId = await SecureStore.getItemAsync('userId');
        setFacultyId(userId);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (userRole === 'student') {
    return (
      <ScrollView
        contentContainerStyle={styles.containerCenter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
      >
        <Ionicons name="construct" size={150} color="black" />
        <Text style={styles.developmentText}>Under Development</Text>
        <Text style={styles.subText}>This feature will be available soon!</Text>
      </ScrollView>
    );
  }

  if (state.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2196F3']}
          tintColor="#2196F3"
        />
      }
    >
      {/* Date Slider */}
      <View style={styles.dateSlider}>
        {generateDates().map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedDate(item.fullDate); // Update the selected date
              console.log(`Selected Date: ${item.fullDate}`);
            }}
            style={[
              styles.dateItem,
              item.fullDate === selectedDate && styles.selectedDateItem, // Highlight selected date
              item.isToday && styles.todayDateItem, // Highlight today's date
            ]}
          >
            <Text
              style={[
                styles.dateText,
                item.fullDate === selectedDate && styles.selectedDateText, // Style for selected date
                item.isToday && styles.todayDateText, // Style for today
              ]}
            >
              {item.day}
            </Text>
            <Text
              style={[
                styles.dateText,
                item.fullDate === selectedDate && styles.selectedDateText, // Style for selected date
                item.isToday && styles.todayDateText, // Style for today
              ]}
            >
              {item.date}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Horizontal ScrollView for Classes */}
      {selectedDate === todayDate && state.schedule.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {state.schedule.map((item, index) => (
            <Card key={index} style={styles.classCard}>
              <Card.Content>
                <Text style={styles.classTime}>{item.duration}</Text>
                <Text style={styles.classSubject}>{item.subject}</Text>
                <Pressable>
                  <Button
                    mode="contained"
                    style={styles.markButton}
                    onPress={() => {
                      console.log(`Taking attendance for: ${item.subject}`);
                      router.push('./markAttendance', { relativeToDirectory: true });
                    }}
                  >
                    <Text style={styles.markText}>Mark Attendance</Text>
                  </Button>
                </Pressable>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Full Schedule */}
      <View style={styles.schedule}>
        <Text style={styles.scheduleTitle}>
          Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </Text>
        {filteredSchedule.length > 0 ? (
          filteredSchedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <View style={[styles.scheduleCard, { backgroundColor: item.color }]}>
                <Text style={styles.scheduleSubject}>{item.subject}</Text>
                <Text style={styles.scheduleDuration}>{item.duration}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noScheduleText}>No schedule available for this day.</Text>
        )}
      </View>
    </ScrollView>
  );  
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#1a1a1a',
  },
  dateSlider: {
    flexDirection: 'row',
    justifyContent : 'space-around',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  dateItem: {
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeDateItem: {
    backgroundColor: '#2196F3',
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
  activeDateText: {
    color: '#fff',
  },
  currentPeriod: {
    margin: 16,
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  periodSubject: {
    color: '#666',
    marginVertical: 8,
  },
  markButton: {
    marginTop: 8,
    backgroundColor: 'white',
  },
  markText:{
    color : 'black',
    fontWeight: 'bold',
  },
  schedule: {
    padding: 16,
    
  },
  scheduleTitle: {
    color : 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  scheduleTime: {
    width: 65,
    color: '#666',
  },
  scheduleCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
  },
  scheduleSubject: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scheduleDuration: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
  },
  horizontalScroll: {
    marginVertical: 20,
  },
  classCard: {
    width: 350, // Fixed width for each card
    marginHorizontal: 10, // Spacing between cards
    padding: 10,
    backgroundColor: '#f5f5f5', // Light white color (not pure white)
    borderRadius: 8,
    elevation: 3, // Adds subtle shadow for better visual appearance
    backgroundColor: 'black',
  },
  classTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Same color as scheduleSubject
    marginBottom: 5,
  },
  classSubject: {
    fontSize: 14,
    color: '#fff', // Same color as scheduleSubject
    marginBottom: 10,
  },
  todayDateItem: {
    backgroundColor: '#2196F3', // Blue background for today's date
  },
  todayDateText: {
    color: '#fff', // White text for today
    fontWeight: 'bold',
  },
  selectedDateItem: {
    backgroundColor: '#FFC107', // Yellow background for selected date
  },
  selectedDateText: {
    color: '#000', // Black text for selected date
    fontWeight: 'bold',
  },
  noScheduleText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
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

export default HomeScreen;
