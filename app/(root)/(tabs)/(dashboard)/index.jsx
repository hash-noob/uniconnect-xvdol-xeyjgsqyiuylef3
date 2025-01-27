import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';
import { router, usePathname } from 'expo-router';
import axios from 'axios';
import { url } from '@/constants/AppContants';


const HomeScreen = () => {
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

  const user = { id: '67973e6b5eab6a9a0d5ecf4a' }; // Replace this with the actual user ID.
  const facultyId = user.id;

  const getRandomColor = () => {
    const colors = ['#2196F3', '#4CAF50', '#9C27B0', '#FFC107', '#FF5722', '#00BCD4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${url}/api/faculty/schedule/${facultyId}`);
        const todaySchedule = response.data.schedule[0].weekly_schedule.find(
          day => day.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })
        );

        const formattedSchedule = todaySchedule
          ? todaySchedule.slots.map(slot => ({
              time: slot.time,
              subject: slot.subject_id, 
              duration: slot.duration,
              color: getRandomColor(),
            }))
          : [];

        setState({
          currentMonth: new Date().toLocaleString('en-US', { month: 'short' }),
          schedule: formattedSchedule,
          statistics: {
            total: 60, // Replace with real data
            present: 56, // Replace with real data
            absent: 4, // Replace with real data
          },
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setState({ ...state, loading: false });
      }
    };

    fetchSchedule();
  }, [facultyId]);

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
      dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        isToday: i === 0,
      });
    }
    return dates;
  };

  if (state.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Date Slider */}
        <View style={styles.dateSlider}>
          {generateDates().map((item, index) => (
            <View
              key={index}
              style={[
                styles.dateItem,
                item.isToday && styles.activeDateItem,
              ]}
            >
              <Text style={[styles.dateText, item.isToday && styles.activeDateText]}>
                {item.day}
              </Text>
              <Text style={[styles.dateText, item.isToday && styles.activeDateText]}>
                {item.date}
              </Text>
            </View>
          ))}
        </View>
  
        {/* Current Period */}
        {state.schedule.length > 0 && (() => {
          const currentTime = new Date();
          const currentPeriod = state.schedule.find(item => {
            const [start, end] = item.duration.split(' - ').map(t => new Date(`1970-01-01T${convertTo24Hour(t)}:00`));
            return currentTime >= start && currentTime <= end;
          });
  
          if (!currentPeriod) {
            return (
              <Card style={styles.currentPeriod}>
                <Card.Content>
                  <Text style={styles.periodTitle}>No ongoing period</Text>
                </Card.Content>
              </Card>
            );
          }
  
          return (
            <Card style={styles.currentPeriod}>
              <Card.Content>
                <Text style={styles.periodTitle}>{currentPeriod.duration}</Text>
                <Text style={styles.periodSubject}>{currentPeriod.subject}</Text>
                <Pressable>
                  <Button
                    mode="contained"
                    style={styles.markButton}
                    onPress={() => {
                      console.log('Pressed');
                      router.push('./markAttendance', { relativeToDirectory: true });
                    }}
                  >
                    <Text style={styles.markText}>Mark Attendance</Text>
                  </Button>
                </Pressable>
              </Card.Content>
            </Card>
          );
        })()}
  
        {/* Full Schedule */}
        <View style={styles.schedule}>
          <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          {state.schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <View style={[styles.scheduleCard, { backgroundColor: item.color }]}>
                <Text style={styles.scheduleSubject}>{item.subject}</Text>
                <Text style={styles.scheduleDuration}>{item.duration}</Text>
              </View>
            </View>
          ))}
        </View>
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
    width: 60,
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
});

export default HomeScreen;
