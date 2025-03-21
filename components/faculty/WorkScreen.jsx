import Card from "@/components/card";
import LeaveApplicationForm from "@/components/LeaveApplicationForm";
import WorkModals from "@/components/WorkModals.jsx";
import { url } from "@/constants/AppContants";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
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
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);

  // Template leave data
  const [leaves, setLeaves] = useState([]);

  // Add these state variables at the top with other useState declarations
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("");
  const [assignmentClass, setAssignmentClass] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      console.log("Fetched userId:", id);
      setUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  // Add useEffect to fetch assignments when userId is available
  useEffect(() => {
    if (userId) {
      fetchAssignments();
    }
  }, [userId]);

  const fetchAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      const response = await axios.get(
        `${url}/api/faculty/assignments/${userId}`
      );
      setAssignments(
        Array.isArray(response.data.assignments)
          ? response.data.assignments
          : []
      );
    } catch (error) {
      console.error("Error fetching assignments:", error);
      Alert.alert("Error", "Failed to fetch assignments. Please try again.");
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const addAssignment = async (assignment) => {
    try {
      const data = { faculty_id: userId, ...assignment };
      const response = await axios.post(`${url}/api/faculty/assignments`, data);
      setAssignments([response.data, ...assignments]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add assignment");
    }
  };

  const fetchEvents = async () => {
    try {
      if (!userId) {
        console.error("userId is not available");
        return;
      }

      const response = await axios.get(`${url}/api/events/${userId}`);

      // console.log('Response:', response.data);
      const fetchedEvents = response.data;

      if (!Array.isArray(fetchedEvents)) {
        console.error("Expected array of events, got:", typeof fetchedEvents);
        return;
      }

      if (fetchedEvents.length === 0) {
        console.log("No events found for this user");
      }

      const marked = {};
      fetchedEvents.forEach((event) => {
        try {
          // Format the date from the ISO string
          const dateStr = event.date.split("T")[0]; // This will give us YYYY-MM-DD
          marked[dateStr] = {
            marked: true,
            dotColor: getEventColor(event.type),
            eventDetails: {
              _id: event._id,
              title: event.title,
              description: event.description,
              type: event.type,
              date: event.date,
              userId: event.userId,
            },
          };
        } catch (error) {
          console.error("Error processing event:", event, error);
        }
      });

      // console.log('Marked dates:', marked);
      setMarkedDates(marked);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert("Error", "Failed to fetch events. Please try again.");
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "class":
        return "#4CAF50";
      case "meeting":
        return "#2196F3";
      case "exam":
        return "#F44336";
      default:
        return "#FFC107";
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
        description: eventData.description || "", // Optional field
        type: eventData.type,
        date: new Date(eventData.date).toISOString(), // Ensure proper date format
      };

      // Validate required fields before making the request
      if (!formattedData.title || !formattedData.date) {
        Alert.alert("Error", "Title and date are required fields");
        return;
      }

      // console.log('Sending event data:', formattedData); // Debug log

      const response = await axios.post(`${url}/api/events/`, formattedData);

      const newEvent = response.data;
      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          marked: true,
          dotColor: getEventColor(newEvent.type),
          eventDetails: newEvent,
        },
      }));

      setModalVisible(false);
    } catch (error) {
      console.error("Error creating event:", error.response?.data || error);
      Alert.alert(
        "Error",
        "Failed to create event. Please ensure all required fields are filled."
      );
    }
  };

  const handleUnmarkDay = async () => {
    try {
      const eventId = selectedEventDetails._id;
      await axios.delete(`${url}/api/events/${eventId}`, {
        data: { userId },
      });

      setMarkedDates((prev) => {
        const updated = { ...prev };
        delete updated[selectedDate];
        return updated;
      });

      setModalVisible(false);
      setSelectedEventDetails(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const response = await axios.put(`${url}/api/events/${eventData._id}`, {
        userId,
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        date: eventData.date,
      });

      const updatedEvent = response.data;

      // Update the markedDates state
      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          marked: true,
          dotColor: getEventColor(updatedEvent.type),
          eventDetails: updatedEvent,
        },
      }));

      // Update the events array
      setEvents((prev) =>
        prev.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error updating event:", error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    }
  };

  const renderAssignment = ({ item }) => (
    <View style={styles.assignmentItem}>
      <View style={styles.assignmentContent}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <Text style={styles.assignmentDescription}>{item.description}</Text>
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

  const handleLeaveSubmitted = (newLeave) => {
    // Update the leaves state with the new leave
    setLeaves([newLeave, ...leaves]);
  };

  const handleApplyLeave = () => {
    setLeaveModalVisible(true);
  };

  const validateAssignmentForm = () => {
    const errors = {};

    if (!assignmentTitle.trim()) errors.title = "Title is required";
    if (!assignmentSubject.trim()) errors.subject = "Subject is required";
    if (!assignmentClass.trim()) errors.class = "Class is required";
    if (!assignmentDueDate.trim()) errors.dueDate = "Due date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAssignment = async () => {
    try {
      if (!validateAssignmentForm()) {
        return;
      }

      const assignment = {
        faculty_id: userId,
        title: assignmentTitle,
        description: assignmentDescription,
        subject: assignmentSubject,
        class: assignmentClass,
        dueDate: assignmentDueDate,
        status: "pending",
      };

      await addAssignment(assignment);

      // Reset form
      setAssignmentTitle("");
      setAssignmentDescription("");
      setAssignmentDueDate("");
      setAssignmentSubject("");
      setAssignmentClass("");
      setFormErrors({});
      setAssignmentModalVisible(false);

      Alert.alert("Success", "Assignment added successfully");
    } catch (error) {
      console.error("Error adding assignment:", error);
      Alert.alert("Error", "Failed to add assignment");
    }
  };

  const fetchLeaves = async () => {
    try {
      if (!userId) return;

      const response = await axios.get(`${url}/api/faculty/leaves/${userId}`);
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch leaves"
      );
    }
  };

  const handleSubmitLeave = async () => {
    // This function is no longer needed as it's handled by the LeaveApplicationForm component
    // But we'll keep it as a reference for now or in case you need it elsewhere
  };

  const handleDeleteLeave = async (leaveId) => {
    Alert.alert(
      "Delete Leave Request",
      "Are you sure you want to delete this leave request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`${url}/api/faculty/leaves/${userId}`, {
                data: { leave_id: leaveId },
              });

              setLeaves(leaves.filter((leave) => leave._id !== leaveId));
              Alert.alert("Success", "Leave request deleted successfully");
            } catch (error) {
              console.error("Error deleting leave:", error);
              Alert.alert(
                "Error",
                error.response?.data?.message ||
                  "Failed to delete leave request"
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Add this useEffect to fetch leaves when component mounts
  useEffect(() => {
    fetchLeaves();
  }, [userId]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      if (userId) {
        const promises = [
          fetchEvents().catch((err) =>
            console.error("Error refreshing events:", err)
          ),
          fetchLeaves().catch((err) =>
            console.error("Error refreshing leaves:", err)
          ),
          fetchAssignments().catch((err) =>
            console.error("Error refreshing assignments:", err)
          ),
        ];

        await Promise.allSettled(promises);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      Alert.alert("Error", "Failed to refresh some data");
    } finally {
      setRefreshing(false);
    }
  }, [userId]);

  const handleDueDateSelect = (day) => {
    setAssignmentDueDate(day.dateString);
    setShowDueDatePicker(false);
  };

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
                  leaves.length === 0 && styles.emptyContainer,
                ]}
              >
                {leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <View key={leave._id} style={styles.leaveItem}>
                      <View style={styles.leaveItemHeader}>
                        <Text style={styles.leaveType}>
                          {leave.type.toUpperCase()}
                        </Text>
                        <View style={styles.rightContainer}>
                          {leave.status === "pending" && (
                            <TouchableOpacity
                              onPress={() => handleDeleteLeave(leave._id)}
                              style={styles.deleteButton}
                            >
                              <MaterialIcons
                                name="delete-outline"
                                size={20}
                                color="#ef4444"
                              />
                            </TouchableOpacity>
                          )}
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor:
                                  leave.status === "approved"
                                    ? "#4ade80"
                                    : leave.status === "rejected"
                                    ? "#ef4444"
                                    : "#fb923c",
                              },
                            ]}
                          >
                            <Text style={styles.statusText}>
                              {leave.status}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.dates}>
                        {leave.startDate} - {leave.endDate}
                      </Text>
                      <Text style={styles.leaveReason}>{leave.reason}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <MaterialIcons
                      name="emoji-emotions"
                      size={32}
                      color="#4ade80"
                    />
                    <Text style={styles.emptyStateText}>
                      Great attendance! Keep up the good work!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Card>
          </View>

          <View style={styles.assignmentsSection}>
            <Card heading="Assignments">
              <View style={styles.assignmentListContainer}>
                {assignmentsLoading ? (
                  <View style={styles.emptyAssignmentContainer}>
                    <MaterialIcons
                      name="hourglass-top"
                      size={32}
                      color="#4B5563"
                    />
                    <Text style={styles.emptyStateText}>
                      Loading assignments...
                    </Text>
                  </View>
                ) : assignments.length > 0 ? (
                  <FlatList
                    data={assignments}
                    renderItem={renderAssignment}
                    keyExtractor={(item) =>
                      item._id || item.id || Math.random().toString()
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    style={styles.assignmentList}
                  />
                ) : (
                  <View style={styles.emptyAssignmentContainer}>
                    <MaterialIcons
                      name="celebration"
                      size={32}
                      color="#4ade80"
                    />
                    <Text style={styles.emptyStateText}>
                      Woohoo! No assignments pending. Time to relax! 🎉
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.addAssignmentButton}
                onPress={() => setAssignmentModalVisible(true)}
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text style={styles.buttonText}>Add Assignment</Text>
              </TouchableOpacity>
            </Card>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleViewMentees}>
        <MaterialIcons name="people" size={24} color="white" />
        <Text style={styles.fabText}>View Mentees</Text>
      </TouchableOpacity>

      {/* Use our new LeaveApplicationForm component */}
      {userId && (
        <LeaveApplicationForm
          visible={leaveModalVisible}
          onClose={() => setLeaveModalVisible(false)}
          userId={userId}
          onLeaveSubmitted={handleLeaveSubmitted}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={assignmentModalVisible}
        onRequestClose={() => setAssignmentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Assignment</Text>
              <TouchableOpacity
                onPress={() => setAssignmentModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Title <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    formErrors.title && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="assignment"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter assignment title"
                    value={assignmentTitle}
                    onChangeText={(text) => {
                      setAssignmentTitle(text);
                      if (text.trim()) {
                        setFormErrors({ ...formErrors, title: null });
                      }
                    }}
                  />
                </View>
                {formErrors.title && (
                  <Text style={styles.errorText}>{formErrors.title}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Subject <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    formErrors.subject && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="book"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter subject name"
                    value={assignmentSubject}
                    onChangeText={(text) => {
                      setAssignmentSubject(text);
                      if (text.trim()) {
                        setFormErrors({ ...formErrors, subject: null });
                      }
                    }}
                  />
                </View>
                {formErrors.subject && (
                  <Text style={styles.errorText}>{formErrors.subject}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Class <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    formErrors.class && styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="groups"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter class (e.g., CSE-A, 3rd Sem)"
                    value={assignmentClass}
                    onChangeText={(text) => {
                      setAssignmentClass(text);
                      if (text.trim()) {
                        setFormErrors({ ...formErrors, class: null });
                      }
                    }}
                  />
                </View>
                {formErrors.class && (
                  <Text style={styles.errorText}>{formErrors.class}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>
                  Due Date <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.inputContainer,
                    formErrors.dueDate && styles.inputError,
                  ]}
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <MaterialIcons
                    name="event"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Text
                    style={[
                      styles.formInput,
                      !assignmentDueDate && styles.placeholderText,
                    ]}
                  >
                    {assignmentDueDate || "Select due date"}
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
                {formErrors.dueDate && (
                  <Text style={styles.errorText}>{formErrors.dueDate}</Text>
                )}
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Description</Text>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="description"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.formInput, styles.descriptionInput]}
                    placeholder="Enter assignment description"
                    value={assignmentDescription}
                    onChangeText={setAssignmentDescription}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {showDueDatePicker && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={handleDueDateSelect}
                    markedDates={{
                      [assignmentDueDate]: {
                        selected: true,
                        selectedColor: "#1a1a1a",
                      },
                    }}
                    minDate={new Date().toISOString().split("T")[0]}
                    theme={{
                      selectedDayBackgroundColor: "#1a1a1a",
                      todayTextColor: "#1a1a1a",
                      arrowColor: "#1a1a1a",
                    }}
                  />
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setAssignmentModalVisible(false);
                    setFormErrors({});
                  }}
                >
                  <Text style={[styles.buttonText, styles.cancelText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleAddAssignment}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    width: 300,
    marginRight: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  assignmentContent: {
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  assignmentDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  assignmentDate: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completedBadge: {
    backgroundColor: "#4ade80",
  },
  pendingBadge: {
    backgroundColor: "#fb923c",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  addAssignmentButton: {
    marginTop: 16,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
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
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  fabText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  leaveSection: {
    marginTop: 20,
  },
  leaveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  applyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 8,
    borderRadius: 5,
  },
  leavesScrollContainer: {
    paddingRight: 20,
  },
  leaveItem: {
    backgroundColor: "#f8f9fa",
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
    // elevation: 3,
  },
  leaveItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  formInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  requiredStar: {
    color: "#e53e3e",
    fontWeight: "bold",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: "#e53e3e",
    borderWidth: 1,
  },
  placeholderText: {
    color: "#999",
  },
  calendarContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#1a1a1a",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  emptyAssignmentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
});
