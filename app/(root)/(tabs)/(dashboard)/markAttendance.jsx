import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card, Surface } from 'react-native-paper';

export const markAttendance = () => {
  const students = [
    { id: '144401', name: 'Arya', status: 'absent' },
    { id: '144403', name: 'Nikki', status: 'absent' },
    { id: '144404', name: 'John', status: 'absent' },
    { id: '144405', name: 'Emma', status: 'absent' },
    { id: '144406', name: 'Mike', status: 'absent' },
    { id: '144407', name: 'Sarah', status: 'absent' }
  ]
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const start = new Date();
      start.setHours(10, 0, 0);
      const end = new Date();
      end.setHours(11, 0, 0);
      
      const total = end - start;
      const current = now - start;
      const newProgress = Math.min(Math.max((current / total) * 100, 0), 100);
      setProgress(newProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAttendance = (studentId, status) => {
    console.log(attendancetoggled)
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.calendar}>
          {/* Calendar implementation */}
          <Surface style={styles.weekDay}>
            <Text>12</Text>
            <Text>F</Text>
          </Surface>
        </View>

        <View style={styles.classInfo}>
          <Text variant="titleLarge">Trigonometry</Text>
          <Text variant="bodyMedium">10 AM - 11 AM</Text>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <ScrollView style={styles.studentList}>
          {students.map(student => (
            <Card key={student.id} style={[styles.studentCard, 
              student.status === 'absent' ? styles.absentCard : styles.presentCard]}>
              <Card.Content style={styles.studentContent}>
                <View>
                  <Text>{student.id}</Text>
                  <Text variant="titleMedium">{student.name}</Text>
                </View>
                <View style={styles.buttonGroup}>
                  <Button
                    mode={student.status === 'present' ? 'contained' : 'outlined'}
                    onPress={() => handleToggleAttendance(student.id, 'present')}>
                    Present
                  </Button>
                  <Button
                    mode={student.status === 'absent' ? 'contained' : 'outlined'}
                    onPress={() => handleToggleAttendance(student.id, 'absent')}>
                    Absent
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <Button 
          mode="contained" 
          style={styles.submitButton}
          onPress={() => console.log('Submit')}>
          Submit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  weekDay: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  classInfo: {
    marginBottom: 20,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
  },
  studentList: {
    maxHeight: '70%',
  },
  studentCard: {
    marginBottom: 8,
  },
  absentCard: {
    backgroundColor: '#fee2e2',
  },
  presentCard: {
    backgroundColor: '#white',
  },
  studentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
  },
});

export default markAttendance;