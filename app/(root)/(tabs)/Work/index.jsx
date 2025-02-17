import Card from "@/components/card";
import WorkModals from "@/components/WorkModals.jsx";
import { url } from "@/constants/AppContants";
import { MaterialIcons } from "@expo/vector-icons";
import axios from 'axios';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import {
  Alert,
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
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
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

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      console.log('Fetched userId:', id);
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      console.log('Fetching events with userId:', userId);
      fetchEvents();
    }
  }, [userId]);

  const fetchEvents = async () => {
    try {
      console.log('Attempting to fetch events with userId:', userId);
            
      const response = await axios.get(`http://10.64.33.126:3000/api/events/67973e6b5eab6a9a0d5ecf4a`);
      
      console.log('Response data:', response.data);
      
      const fetchedEvents = response.data;
      
      if (!Array.isArray(fetchedEvents)) {
        console.error('Expected array of events, got:', typeof fetchedEvents);
        return;
      }
      
      if (fetchedEvents.length === 0) {
        console.log('No events found for this user');
      }
      
      const marked = {};
      fetchedEvents.forEach(event => {
        try {
          // Format the date from the ISO string
          const dateStr = event.date.split('T')[0]; // This will give us YYYY-MM-DD
          marked[dateStr] = {
            marked: true,
            dotColor: getEventColor(event.type),
            eventDetails: {
              _id: event._id,
              title: event.title,
              description: event.description,
              type: event.type,
              date: event.date,
              userId: event.userId
            }
          };
        } catch (error) {
          console.error('Error processing event:', event, error);
        }
      });
      
      console.log('Marked dates:', marked);
      setMarkedDates(marked);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Alert.alert(
        'Error',
        'Failed to fetch events. Please try again.'
      );
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'class': return '#4CAF50';
      case 'meeting': return '#2196F3';
      case 'exam': return '#F44336';
      default: return '#FFC107';
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    const isMarked = markedDates[day.dateString]?.marked;
    setIsMarkedDayModal(isMarked);
    setSelectedEventDetails(markedDates[day.dateString]?.eventDetails);
    setModalVisible(true);
  };

  const handleMarkDay = async (eventData) => {
    try {
      // Format the date properly and ensure all required fields
      const formattedData = {
        userId: userId,
        title: eventData.title,
        description: eventData.description || '', // Optional field
        type: eventData.type,
        date: new Date(eventData.date).toISOString(), // Ensure proper date format
      };

      // Validate required fields before making the request
      if (!formattedData.title || !formattedData.date) {
        Alert.alert('Error', 'Title and date are required fields');
        return;
      }

      console.log('Sending event data:', formattedData); // Debug log

      const response = await axios.post(`${url}/api/events/`, formattedData);

      const newEvent = response.data;
      setMarkedDates(prev => ({
        ...prev,
        [selectedDate]: {
          marked: true,
          dotColor: getEventColor(newEvent.type),
          eventDetails: newEvent
        }
      }));

      setModalVisible(false);
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error);
      Alert.alert(
        'Error',
        'Failed to create event. Please ensure all required fields are filled.'
      );
    }
  };

  const handleUnmarkDay = async () => {
    try {
      const eventId = selectedEventDetails._id;
      await axios.delete(`${url}/api/events/${eventId}`, {
        data: { userId }
      });

      setMarkedDates(prev => {
        const updated = { ...prev };
        delete updated[selectedDate];
        return updated;
      });

      setModalVisible(false);
      setSelectedEventDetails(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const response = await axios.put(
        `${url}/api/events/${eventData._id}`,
        {
          userId,
          title: eventData.title,
          description: eventData.description,
          type: eventData.type,
          date: eventData.date
        }
      );

      const updatedEvent = response.data;
      
      // Update the markedDates state
      setMarkedDates(prev => ({
        ...prev,
        [selectedDate]: {
          marked: true,
          dotColor: getEventColor(updatedEvent.type),
          eventDetails: updatedEvent
        }
      }));

      // Update the events array
      setEvents(prev => 
        prev.map(event => 
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert(
        'Error',
        'Failed to update event. Please try again.'
      );
    }
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
                markingType="dot"
                markedDates={markedDates}
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
                eventDetails={selectedEventDetails}
                handleMarkDay={handleMarkDay}
                handleUnmarkDay={handleUnmarkDay}
                handleUpdateEvent={handleUpdateEvent}
                selectedDate={selectedDate}
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
