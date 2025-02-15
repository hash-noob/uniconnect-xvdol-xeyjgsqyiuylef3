import Card from "@/components/card";
import WorkModals from "@/components/WorkModals";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

export default function Work() {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventText, setEventText] = useState("");
  const [isMarkedDayModal, setIsMarkedDayModal] = useState(false);
  const [assignments, setAssignments] = useState([
    {
      id: "1",
      title: "Math Assignment",
      className: "MTH 201",
      dueDate: "2024-03-25",
      status: "pending",
    },
    {
      id: "2",
      title: "Physics Lab Report",
      className: "PHY 202",
      dueDate: "2024-03-28",
      status: "completed",
    },
    {
      id: "3",
      title: "Literature Review",
      className: "ENG 101",
      dueDate: "2024-04-01",
      status: "pending",
    },
  ]);
  const [leaveReason, setLeaveReason] = useState("");

  // Example of marking dates with events
  const events = {
    "2025-03-20": {
      marked: true,
      color: "#50cebb",
      text: "Example Event 1",
    },
    "2025-03-25": {
      marked: true,
      text: "Example Event 2",
    },
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const isMarked =
      markedDates[day.dateString]?.marked || events[day.dateString]?.marked;
    setIsMarkedDayModal(isMarked);
    setModalVisible(true);

    if (isMarked) {
      // If marked, get the event text
      setEventText(
        markedDates[day.dateString]?.text || events[day.dateString]?.text || ""
      );
    } else {
      setEventText("");
    }
  };

  const handleMarkDay = () => {
    if (eventText.trim()) {
      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          marked: true,
          dotColor: "#50cebb",
          text: eventText,
        },
      }));
    }
    setModalVisible(false);
    setEventText("");
  };

  const handleUnmarkDay = () => {
    setMarkedDates((prev) => {
      const updated = { ...prev };
      delete updated[selectedDate];
      return updated;
    });
    setModalVisible(false);
    setEventText("");
  };

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentItem}>
      <View
        style={styles.assignmentContent}
        onClick={() => {
          console.log(item.title);
        }}
      >
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <Text style={styles.className}>{item.className}</Text>
        <Text style={styles.assignmentDate}>Due: {item.dueDate}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "completed"
            ? styles.completedBadge
            : styles.pendingBadge,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  const handleViewMentees = () => {
    router.push("/Work/meentes");
  };

  const handleApplyLeave = () => {
    if (leaveReason.trim()) {
      // Handle leave application submission
      console.log("Leave application submitted:", leaveReason);
      setLeaveReason("");
    }
  };

  return (
    <>
      <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <View style={styles.calendarSection}>
            <Card heading="Event Calendar">
              <Calendar
                style={styles.calendar}
                onDayPress={handleDayPress}
                enableSwipeMonths={true}
                markingType="period"
                markedDates={{
                  ...events,
                  ...markedDates,
                }}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  selectedDayBackgroundColor: "#50cebb",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#50cebb",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                }}
              />

              <WorkModals
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                isMarkedDayModal={isMarkedDayModal}
                eventText={eventText}
                setEventText={setEventText}
                handleMarkDay={handleMarkDay}
                handleUnmarkDay={handleUnmarkDay}
              />
            </Card>
          </View>

          <View style={styles.assignmentsSection}>
            <Card heading="Assignments">
              <View style={styles.assignmentListContainer}>
                <FlatList
                  data={assignments}
                  renderItem={renderAssignment}
                  keyExtractor={(item) => item.id}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  style={styles.assignmentList}
                />
              </View>
              <TouchableOpacity style={styles.addAssignmentButton}>
                <Text style={styles.buttonText}>Add Assignment</Text>
              </TouchableOpacity>
            </Card>
          </View>

          <View style={styles.leaveSection}>
            <Card heading="Apply for Leave">
              <TextInput
                style={styles.leaveInput}
                multiline
                numberOfLines={4}
                placeholder="Enter reason for leave..."
                value={leaveReason}
                onChangeText={setLeaveReason}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={styles.applyLeaveButton}
                onPress={handleApplyLeave}
              >
                <Text style={styles.buttonText}>Apply Leave</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleViewMentees}>
        <MaterialIcons name="people" size={24} color="white" />
        <Text style={styles.fabText}>View Mentees</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  calendarSection: {
    marginBottom: 16,
  },
  assignmentsSection: {
    marginBottom: 16,
  },
  assignmentListContainer: {
    height: 160,
  },
  assignmentList: {
    paddingVertical: 10,
  },
  calendar: {
    borderRadius: 10,
    marginTop: 10,
  },
  assignmentItem: {
    width: 280,
    marginRight: 16,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  assignmentContent: {
    marginBottom: 10,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    marginBottom: 2,
  },
  assignmentDate: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: "#4ade80",
  },
  pendingBadge: {
    backgroundColor: "#fb923c",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  addAssignmentButton: {
    marginTop: 20,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "grey",
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  leaveSection: {
    marginBottom: 16,
  },
  leaveInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    backgroundColor: "#f8f9fa",
    height: 100,
    fontSize: 16,
  },
  applyLeaveButton: {
    marginTop: 16,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});
