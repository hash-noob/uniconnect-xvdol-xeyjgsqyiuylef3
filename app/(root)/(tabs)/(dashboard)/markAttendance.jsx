import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Surface, Text } from "react-native-paper";

export const MarkAttendance = () => {
  // Get route parameters and add debug logging
  const params = useLocalSearchParams();
  console.log("Received params:", JSON.stringify(params));
  
  // Default values in case params are undefined
  const subject_id = params?.subject_id || "Unknown Subject";
  const class_id = params?.class_id || "Unknown Class";
  const duration = params?.duration || "9 AM - 10 AM";
  
  // Log individual parameters to check their values
  console.log("subject_id:", subject_id);
  console.log("class_id:", class_id);
  console.log("duration:", duration);
  
  // Sanitize values for storage key to ensure they only contain valid characters
  const sanitizeForKey = (value) => {
    if (!value) return "unknown";
    // Replace any non-alphanumeric characters (except for allowed ones: ".", "-", "_")
    return value.toString().replace(/[^a-zA-Z0-9\.\-\_]/g, "_");
  };
  
  // Create a unique key for storage based on subject and class (with sanitized values)
  const sanitizedSubjectId = sanitizeForKey(subject_id);
  const sanitizedClassId = sanitizeForKey(class_id);
  const today = new Date().toISOString().split('T')[0].replace(/-/g, "_"); // Replace hyphens with underscores
  
  const storageKey = `attendance_${sanitizedSubjectId}_${sanitizedClassId}_${today}`;
  console.log("Using storage key:", storageKey);
  
  const [students, setStudents] = useState([
    { id: "144401", name: "Arya", status: "absent" },
    { id: "144403", name: "Nikki", status: "absent" },
    { id: "144404", name: "John", status: "absent" },
    { id: "144405", name: "Emma", status: "absent" },
    { id: "144406", name: "Mike", status: "absent" },
    { id: "144407", name: "Sarah", status: "absent" },
  ]);
  const [progress, setProgress] = useState(0);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
  });
  const [classDetails, setClassDetails] = useState({
    subject: subject_id,
    classId: class_id,
    time: duration 
  });
  const [loading, setLoading] = useState(true);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load previously saved attendance data
  useEffect(() => {
    const loadSavedAttendance = async () => {
      try {
        console.log("Attempting to load attendance data with key:", storageKey);
        const savedData = await SecureStore.getItemAsync(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setStudents(parsedData.students || students);
          setIsAttendanceMarked(true);
          console.log("Loaded saved attendance data successfully");
        } else {
          console.log("No previous attendance data found for this class and date");
        }
      } catch (error) {
        console.error("Error loading saved attendance:", error);
        setErrorMessage(`Failed to load saved attendance data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedAttendance();
  }, [storageKey]);

  // Update class details when params change
  useEffect(() => {
    console.log("Params changed, updating class details");
    setClassDetails({
      subject: subject_id,
      classId: class_id,
      time: duration
    });
  }, [subject_id, class_id, duration]);

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

  useEffect(() => {
    const present = students.filter(student => student.status === "present").length;
    const absent = students.length - present;
    setAttendanceStats({ present, absent });
  }, [students]);

  // In the future, you would fetch students based on class_id
  // useEffect(() => {
  //   if (class_id && class_id !== "Unknown Class") {
  //     fetchStudentsForClass(class_id);
  //   }
  // }, [class_id]);

  const handleToggleAttendance = (studentId, newStatus) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(
      students.map((student) => ({ ...student, status: "present" }))
    );
  };

  const markAllAbsent = () => {
    setStudents(
      students.map((student) => ({ ...student, status: "absent" }))
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    setErrorMessage(null);
    
    try {
      // Create the attendance data to save
      const dataToSave = {
        students,
        subject: classDetails.subject,
        classId: classDetails.classId,
        timestamp: new Date().toISOString(),
      };
      
      // Convert to JSON and check size (SecureStore has limitations)
      const jsonData = JSON.stringify(dataToSave);
      if (jsonData.length > 2000) {
        // If data is too large, store a simpler version with just the essential info
        console.warn("Attendance data is large, storing simplified version");
        const simplifiedData = {
          students: students.map(s => ({ id: s.id, status: s.status })),
          subject: classDetails.subject,
          classId: classDetails.classId,
          timestamp: new Date().toISOString(),
          isSimplified: true
        };
        await SecureStore.setItemAsync(storageKey, JSON.stringify(simplifiedData));
      } else {
        // Store the full data
        await SecureStore.setItemAsync(storageKey, jsonData);
      }
      
      setIsAttendanceMarked(true);
      console.log("Attendance data saved with key:", storageKey);
      
      setSubmissionComplete(true);
      console.log("Attendance submitted for:", classDetails.subject);
      console.log("Class ID (for backend):", classDetails.classId);
    } catch (error) {
      console.error("Error saving attendance data:", error);
      setErrorMessage(`Failed to save attendance data: ${error.message}. Please try again.`);
      setSubmissionComplete(false);
    } finally {
      setSaving(false);
    }
  };

  const closeConfirmation = () => {
    setSubmissionComplete(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading attendance data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.calendar}>
          <Surface style={styles.weekDay}>
            <Text variant="titleMedium" style={styles.dateText}>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              {isAttendanceMarked && (
                <Text style={styles.markedText}> • Attendance Marked</Text>
              )}
            </Text>
          </Surface>
        </View>

        <View style={styles.classInfoContainer}>
          <View style={styles.classInfo}>
            <Text
              variant="titleLarge"
              style={styles.subjectTitle}
            >
              {classDetails.subject}
            </Text>
            <Text
              variant="bodyMedium"
              style={styles.timeText}
            >
              {classDetails.time}
            </Text>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          
          <View style={styles.quickActionButtons}>
            <Button 
              mode="contained"
              onPress={markAllPresent}
              style={styles.quickActionButton}
              labelStyle={styles.quickActionButtonText}
              icon="check-all"
              compact
            >
              All Present
            </Button>
            <Button 
              mode="contained"
              onPress={markAllAbsent}
              style={[styles.quickActionButton, styles.absentQuickButton]}
              labelStyle={styles.quickActionButtonText}
              icon="close-box-multiple"
              compact
            >
              All Absent
            </Button>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Present</Text>
            <Text style={styles.statValuePresent}>{attendanceStats.present}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Absent</Text>
            <Text style={styles.statValueAbsent}>{attendanceStats.absent}</Text>
          </View>
        </View>

        <ScrollView style={styles.studentList}>
          {students.map((student) => (
            <Card
              key={student.id}
              style={[
                styles.studentCard,
                student.status === "absent"
                  ? styles.absentCard
                  : styles.presentCard,
              ]}
            >
              <Card.Content style={styles.studentContent}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentId}>
                    {student.id}
                  </Text>
                  <Text style={styles.studentName}>
                    {student.name}
                  </Text>
                </View>
                <View style={styles.buttonGroup}>
                  <Button
                    mode={
                      student.status === "present" ? "contained" : "outlined"
                    }
                    onPress={() =>
                      handleToggleAttendance(student.id, "present")
                    }
                    style={
                      student.status === "present"
                        ? styles.presentButton
                        : styles.presentButtonOutlined
                    }
                    labelStyle={
                      student.status === "present"
                        ? styles.presentText
                        : styles.presentTextOutlined
                    }
                    compact
                  >
                    Present
                  </Button>
                  <Button
                    mode={
                      student.status === "absent" ? "contained" : "outlined"
                    }
                    onPress={() => handleToggleAttendance(student.id, "absent")}
                    style={
                      student.status === "absent"
                        ? styles.absentButton
                        : styles.absentButtonOutlined
                    }
                    labelStyle={
                      student.status === "absent"
                        ? styles.absentText
                        : styles.absentTextOutlined
                    }
                    compact
                  >
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
          onPress={handleSubmit}
          disabled={saving}
          loading={saving}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            {isAttendanceMarked ? "Update Attendance" : "Submit Attendance"}
          </Text>
        </Button>
      </View>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={submissionComplete}
        onRequestClose={closeConfirmation}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons name="check-circle" size={60} color="#10B981" />
            </View>
            <Text style={styles.modalTitle}>
              {isAttendanceMarked ? "Attendance Updated" : "Attendance Submitted"}
            </Text>
            
            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <MaterialCommunityIcons name="account-check" size={24} color="#10B981" />
                <Text style={styles.modalStatText}>Present: {attendanceStats.present}</Text>
              </View>
              <View style={styles.modalStatItem}>
                <MaterialCommunityIcons name="account-cancel" size={24} color="#EF4444" />
                <Text style={styles.modalStatText}>Absent: {attendanceStats.absent}</Text>
              </View>
              <View style={styles.modalClassInfo}>
                <MaterialCommunityIcons name="book-education" size={24} color="#4158D0" />
                <Text style={styles.modalStatText}>{classDetails.subject}</Text>
              </View>
            </View>
            
            <Button
              mode="contained"
              style={styles.modalButton}
              onPress={closeConfirmation}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  calendar: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  weekDay: {
    padding: 16,
    width: "100%",
    alignItems: "left",
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classInfoContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
  classInfo: {
    flex: 1,
    paddingRight: 12,
  },
  quickActionButtons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
  },
  quickActionButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    minWidth: 120,
  },
  absentQuickButton: {
    backgroundColor: "#EF4444",
  },
  quickActionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#4a90e2",
    borderRadius: 3,
    marginTop: 16,
  },
  selectionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  selectAllButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#10B981",
    borderRadius: 10,
  },
  selectAllButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  deselectAllButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
  },
  deselectAllButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  statValuePresent: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
  },
  statValueAbsent: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EF4444",
  },
  studentList: {
    maxHeight: "50%",
  },
  studentCard: {
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  absentCard: {
    backgroundColor: "#fff5f5",
  },
  presentCard: {
    backgroundColor: "#f0fff4",
  },
  studentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentId: {
    color: "#718096",
    fontSize: 13,
    marginBottom: 2,
  },
  studentName: {
    color: "#2d3748",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#1a1a1a",
    paddingVertical: 8,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dateText: {
    fontWeight: "700",
    color: "#2d3748",
    fontSize: 16,
  },
  markedText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
  presentButton: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
    minWidth: 80,
    height: 36,
  },
  presentButtonOutlined: {
    backgroundColor: "transparent",
    borderColor: "#10B981",
    minWidth: 80,
    height: 36,
  },
  presentText: {
    color: "#FFFFFF",
  },
  presentTextOutlined: {
    color: "#10B981",
  },
  absentButton: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
    minWidth: 80,
    height: 36,
  },
  absentButtonOutlined: {
    backgroundColor: "transparent",
    borderColor: "#EF4444",
    minWidth: 80,
    height: 36,
  },
  absentText: {
    color: "#FFFFFF",
  },
  absentTextOutlined: {
    color: "#EF4444",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 16,
  },
  modalStats: {
    width: "100%",
    marginBottom: 24,
  },
  modalStatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  modalStatText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#4a5568",
    fontWeight: "500",
  },
  modalButton: {
    backgroundColor: "#4158D0",
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalClassInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  subjectTitle: {
    color: "#2d3748",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 20,
  },
  timeText: {
    color: "#718096",
    marginBottom: 12,
  },
});

export default MarkAttendance;
