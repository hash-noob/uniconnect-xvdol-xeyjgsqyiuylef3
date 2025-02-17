import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Surface, Text } from "react-native-paper";

export const MarkAttendance = () => {
  const [students, setStudents] = useState([
    { id: "144401", name: "Arya", status: "absent" },
    { id: "144403", name: "Nikki", status: "absent" },
    { id: "144404", name: "John", status: "absent" },
    { id: "144405", name: "Emma", status: "absent" },
    { id: "144406", name: "Mike", status: "absent" },
    { id: "144407", name: "Sarah", status: "absent" },
  ]);
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

  const handleToggleAttendance = (studentId, newStatus) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

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
            </Text>
          </Surface>
        </View>

        <View style={styles.classInfo}>
          <Text
            variant="titleLarge"
            style={{
              color: "#2d3748",
              fontWeight: "700",
              marginBottom: 4,
            }}
          >
            CS101
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: "#718096",
              marginBottom: 8,
            }}
          >
            9 AM - 10 AM
          </Text>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
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
                <View>
                  <Text
                    style={{
                      color: "#718096",
                      fontSize: 13,
                      marginBottom: 2,
                    }}
                  >
                    {student.id}
                  </Text>
                  <Text
                    style={{
                      color: "#2d3748",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
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
          onPress={() => console.log("Submit")}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Submit
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  classInfo: {
    marginBottom: 24,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#4a90e2",
    borderRadius: 3,
    marginTop: 16,
  },
  studentList: {
    maxHeight: "62%",
  },
  studentCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
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
    padding: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  submitButton: {
    marginTop: 24,
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
  presentButton: {
    backgroundColor: "#10B981", // Green for present when active
    borderColor: "#10B981",
    minWidth: 90,
  },
  presentButtonOutlined: {
    backgroundColor: "transparent",
    borderColor: "#10B981",
    minWidth: 90,
  },
  presentText: {
    color: "#FFFFFF",
  },
  presentTextOutlined: {
    color: "#10B981",
  },
  absentButton: {
    backgroundColor: "#EF4444", // Red for absent when active
    borderColor: "#EF4444",
    minWidth: 90,
  },
  absentButtonOutlined: {
    backgroundColor: "transparent",
    borderColor: "#EF4444",
    minWidth: 90,
  },
  absentText: {
    color: "#FFFFFF",
  },
  absentTextOutlined: {
    color: "#EF4444",
  },
});

export default MarkAttendance;
