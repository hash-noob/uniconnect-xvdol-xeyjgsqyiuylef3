import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Card from '@/components/card';

export default function Work() {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  // Example of marking dates with events
  const events = {
    '2024-03-20': { marked: true, dotColor: '#50cebb' },
    '2024-03-25': { marked: true, dotColor: '#50cebb' },
  };

  return (
    <View style={styles.container}>
      <Card heading="Upcoming Dates" description="Calendar Events">
        <Calendar
          style={styles.calendar}
          onDayPress={day => {
            setSelectedDate(day.dateString);
            // You can handle date selection here
            setMarkedDates({
              ...markedDates,
              [day.dateString]: {
                selected: true,
                marked: true,
                dotColor: '#50cebb'
              }
            });
          }}
          markedDates={{
            ...events,
            ...markedDates
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            selectedDayBackgroundColor: '#50cebb',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#50cebb',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
          }}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    marginTop: 10,
  },
});