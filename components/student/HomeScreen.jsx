import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LineChart } from "react-native-gifted-charts";
import { Card } from "react-native-paper";

export default function StudentHomeScreen() {
  // Mock data - replace with actual data from your backend
  const attendanceData = {
    present: 85,
    absent: 15,
  };

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", time: "10:00 AM", room: "Room 101" },
    { id: 2, subject: "Physics", time: "11:30 AM", room: "Room 203" },
    { id: 3, subject: "Computer Science", time: "2:00 PM", room: "Lab 3" },
  ];

  const markedDates = {
    "2024-03-10": { marked: true, dotColor: "green" },
    "2024-03-12": { marked: true, dotColor: "red" },
    "2024-03-15": { marked: true, dotColor: "green" },
  };
  const data = [
    { value: 85, label: "Jan" },
    { value: 80, label: "Feb" },
    { value: 90, label: "Mar" },
    { value: 85, label: "Apr" },
    { value: 88, label: "May" },
    { value: 95, label: "Jun" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.notificationBell}>
          <Ionicons name="notifications" size={24} color="#1a1a1a" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Card style={[styles.card, { backgroundColor: "#e8f5e9" }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Present</Text>
            <Text style={styles.cardValue}>{attendanceData.present}%</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.card, { backgroundColor: "#ffebee" }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Absent</Text>
            <Text style={styles.cardValue}>{attendanceData.absent}%</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.calendarCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Attendance Calendar</Text>
          <Calendar
            markedDates={markedDates}
            theme={{
              todayTextColor: "#1a1a1a",
              selectedDayBackgroundColor: "#1a1a1a",
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.classesCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Upcoming Classes</Text>
          {upcomingClasses.map((class_) => (
            <View key={class_.id} style={styles.classItem}>
              <View style={styles.classInfo}>
                <Text style={styles.subjectName}>{class_.subject}</Text>
                <Text style={styles.classDetails}>
                  {class_.time} • {class_.room}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#1a1a1a" />
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.trendsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Attendance Trends</Text>
          <LineChart
            areaChart
            data={data}
            width={300}
            height={200}
            spacing={40}
            initialSpacing={20}
            color="#1a1a1a"
            textColor="#333"
            thickness={2}
            startFillColor="rgba(26, 26, 26, 0.2)"
            endFillColor="rgba(26, 26, 26, 0.05)"
            startOpacity={0.9}
            endOpacity={0.2}
            backgroundColor="#fff"
            rulesColor="#e3e3e3"
            rulesType="solid"
            yAxisTextStyle={{ color: "#333" }}
            xAxisTextStyle={{ color: "#333" }}
            hideDataPoints
            curved
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  notificationBell: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: "#666666",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  calendarCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  classesCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  trendsCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  classInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  classDetails: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
