import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function WorkModals({
  modalVisible,
  setModalVisible,
  isMarkedDayModal,
  eventDetails,
  handleMarkDay,
  handleUnmarkDay,
  handleUpdateEvent,
  selectedDate,
}) {
  const [eventType, setEventType] = useState('other');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (modalVisible && eventDetails && isEditing) {
      setTitle(eventDetails.title);
      setDescription(eventDetails.description);
      setEventType(eventDetails.type);
    } else if (!modalVisible) {
      setTitle('');
      setDescription('');
      setEventType('other');
      setIsEditing(false);
    }
  }, [modalVisible, eventDetails, isEditing]);

  const handleSubmit = () => {
    const eventData = {
      title,
      description,
      type: eventType,
      date: selectedDate
    };

    if (isEditing) {
      handleUpdateEvent({ ...eventData, _id: eventDetails._id });
    } else {
      handleMarkDay(eventData);
    }

    setTitle('');
    setDescription('');
    setEventType('other');
    setIsEditing(false);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isMarkedDayModal ? (isEditing ? "Edit Event" : "Event Details") : "Add New Event"}
          </Text>

          {isMarkedDayModal && !isEditing ? (
            // View mode for marked day
            <>
              <Text style={styles.eventLabel}>Title:</Text>
              <Text style={styles.eventText}>{eventDetails?.title}</Text>
              <Text style={styles.eventLabel}>Description:</Text>
              <Text style={styles.eventText}>{eventDetails?.description}</Text>
              <Text style={styles.eventLabel}>Type:</Text>
              <Text style={styles.eventText}>{eventDetails?.type}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.buttonText}>Edit Event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.unmarkButton]}
                  onPress={handleUnmarkDay}
                >
                  <Text style={styles.buttonText}>Delete Event</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Edit/Create mode
            <>
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Event Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
              <Picker
                selectedValue={eventType}
                onValueChange={(itemValue) => setEventType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Class" value="class" />
                <Picker.Item label="Meeting" value="meeting" />
                <Picker.Item label="Exam" value="exam" />
                <Picker.Item label="Other" value="other" />
              </Picker>
              <TouchableOpacity
                style={[styles.button, styles.markButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {isEditing ? "Update Event" : "Create Event"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => {
              setModalVisible(false);
              setIsEditing(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  eventText: {
    fontSize: 16,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    minHeight: 100,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  markButton: {
    backgroundColor: "#50cebb",
  },
  unmarkButton: {
    backgroundColor: "#ff6b6b",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  descriptionInput: {
    minHeight: 100,
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#666",
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 5,
  },
}); 