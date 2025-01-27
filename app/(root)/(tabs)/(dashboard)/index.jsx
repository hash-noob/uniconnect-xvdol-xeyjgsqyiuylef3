import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Button, Text, Card} from 'react-native-paper';
import {router,usePathname} from 'expo-router';

const initialState = {
    currentMonth: 'Nov',
    schedule: [
      { time: '10 AM', subject: 'Trigonometry - 1', duration: '10 AM - 11 AM', color: '#2196F3' },
      { time: '11 AM', subject: 'Physics Lab', duration: '11 AM - 12 PM', color: '#4CAF50' },
      { time: '12 PM', subject: 'Chemistry', duration: '12 PM - 1 PM', color: '#9C27B0' },
      { time: '2 PM', subject: 'English', duration: '2 PM - 3 PM', color: '#FFC107' },
    ],
    statistics: {
      total: 60,
      present: 56,
      absent: 4
    }
  };

const HomeScreen = () => {
  const { currentMonth, schedule } = initialState

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

  console.log(usePathname())

  return (
    <View style={styles.container}>
      <ScrollView>
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

        <Card style={styles.currentPeriod}>
          <Card.Content>
            <Text style={styles.periodTitle}>10 AM - 11 AM</Text>
            <Text style={styles.periodSubject}>Trigonometry - 1</Text>
            <Pressable>
            <Button
              mode="contained"
              style={styles.markButton}
              onPress={ ()=>{
              console.log("Pressed")
              router.push("./markAttendance", { relativeToDirectory: true })
            } }
            >
              <Text style={styles.markText} >Mark Attendance</Text>
            </Button>
            </Pressable>
          </Card.Content>
        </Card>

        <View style={styles.schedule}>
          <Text style={styles.scheduleTitle}>Today's Schedule</Text>
          {schedule.map((item, index) => (
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
};

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
