import Card from "@/components/card";
import WorkModals from "@/components/WorkModals.jsx";
import { url } from "@/constants/AppContants";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  const [refreshing, setRefreshing] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveType, setLeaveType] = useState('casual');

  // Template leave data
  const [leaves, setLeaves] = useState([
    {
      _id: '1',
      type: 'sick',
      startDate: '2024-02-15',
      endDate: '2024-02-16',
      reason: 'Fever and cold',
      status: 'approved',
    },
    {
      _id: '2',
      type: 'casual',
      startDate: '2024-02-20',
      endDate: '2024-02-21',
      reason: 'Family function',
      status: 'pending',
    },
  ]);

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
      if (!userId) {
        console.error('userId is not available');
        return;
      }

      // For Android Emulator
      // For iOS Simulator
      // const baseUrl = 'http://127.0.0.1:3000';
      // For physical device, use your computer's IP address
      // const baseUrl = 'http://192.168.1.XXX:3000';

      console.log('Attempting to fetch events with userId:', userId);
      
      const response = await axios.get(`${url}/api/events/${userId}`);
      
      console.log('Response:', response.data);
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
    setLeaveModalVisible(true);
  };

  const handleSubmitLeave = () => {
    const newLeave = {
      _id: String(leaves.length + 1),
      type: leaveType,
      startDate,
      endDate,
      reason: leaveReason,
      status: 'pending',
    };

    setLeaves([newLeave, ...leaves]);
    setLeaveModalVisible(false);
    setLeaveReason('');
    setLeaveType('casual');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchEvents();
    } catch (error) {
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={styles.scrollContainer} 
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1a1a1a"]}
            tintColor="#1a1a1a"
          />
        }
      >
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

          <View style={styles.leaveSection}>
            <Card heading="Leave Requests">
              <View style={styles.leaveHeader}>
                <Text style={styles.sectionTitle}>Recent Leaves</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyLeave}
                >
                  <MaterialIcons name="add" size={24} color="white" />
                  <Text style={styles.buttonText}>Apply Leave</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.leavesScrollContainer,
                  leaves.length === 0 && styles.emptyContainer
                ]}
              >
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <View key={leave._id} style={styles.leaveItem}>
                      <View style={styles.leaveItemHeader}>
                        <Text style={styles.leaveType}>{leave.type.toUpperCase()}</Text>
                        <View style={[
                          styles.statusBadge,
                          { backgroundColor: leave.status === 'approved' ? '#4ade80' : 
                                          leave.status === 'rejected' ? '#ef4444' : '#fb923c' }
                        ]}>
                          <Text style={styles.statusText}>{leave.status}</Text>
                        </View>
                      </View>
                      <Text style={styles.dates}>{leave.startDate} - {leave.endDate}</Text>
                      <Text style={styles.leaveReason}>{leave.reason}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <MaterialIcons name="emoji-emotions" size={32} color="#4ade80" />
                    <Text style={styles.emptyStateText}>Great attendance! Keep up the good work!</Text>
                  </View>
                )}
              </ScrollView>
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
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleViewMentees}
      >
        <MaterialIcons name="people" size={24} color="white" />
        <Text style={styles.fabText}>View Mentees</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={leaveModalVisible}
        onRequestClose={() => setLeaveModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply for Leave</Text>

            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
            />

            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={leaveType}
                onValueChange={setLeaveType}
                style={styles.picker}
              >
                <Picker.Item label="Casual Leave" value="casual" />
                <Picker.Item label="Sick Leave" value="sick" />
                <Picker.Item label="Vacation" value="vacation" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <TextInput
              style={[styles.input, styles.reasonInput]}
              placeholder="Enter reason for leave..."
              value={leaveReason}
              onChangeText={setLeaveReason}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitLeave}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLeaveModalVisible(false)}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  fabText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  leaveSection: {
    marginTop: 20,
  },
  leaveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 8,
    borderRadius: 5,
  },
  leavesScrollContainer: {
    paddingRight: 20,
  },
  leaveItem: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
    width: 280,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    elevation: 3,
  },
  leaveItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#1a1a1a',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: {
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});
