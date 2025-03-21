import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

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
  const [eventTypeName, setEventTypeName] = useState('Other');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);

  // Event types data
  const eventTypes = [
    { label: 'Class', value: 'class' },
    { label: 'Meeting', value: 'meeting' },
    { label: 'Exam', value: 'exam' },
    { label: 'Other', value: 'other' }
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (modalVisible && eventDetails && isEditing) {
      setTitle(eventDetails.title);
      setDescription(eventDetails.description);
      setEventType(eventDetails.type);
      
      // Set the event type name based on type value
      const selectedType = eventTypes.find(type => type.value === eventDetails.type);
      if (selectedType) {
        setEventTypeName(selectedType.label);
      }
    } else if (!modalVisible) {
      setTitle('');
      setDescription('');
      setEventType('other');
      setEventTypeName('Other');
      setIsEditing(false);
    }
  }, [modalVisible, eventDetails, isEditing]);

  const handleSubmit = () => {
    Keyboard.dismiss();
    
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
    setEventTypeName('Other');
    setIsEditing(false);
  };

  // Select event type handler
  const handleSelectEventType = (type) => {
    setEventType(type.value);
    setEventTypeName(type.label);
    setShowEventTypeModal(false);
  };

  // Open event type modal
  const openEventTypeModal = () => {
    Keyboard.dismiss();
    setShowEventTypeModal(true);
  };

  // Get icon for event type
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'class': return 'class';
      case 'meeting': return 'people';
      case 'exam': return 'assignment';
      default: return 'event-note';
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        Keyboard.dismiss();
        setModalVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isMarkedDayModal ? (isEditing ? "Edit Event" : "Event Details") : "Add New Event"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(false);
                  setIsEditing(false);
                }}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {isMarkedDayModal && !isEditing ? (
                // View mode for marked day
                <View style={styles.eventDetailsContainer}>
                  <View style={styles.eventTypeIcon}>
                    <MaterialIcons 
                      name={getEventTypeIcon(eventDetails?.type)} 
                      size={32} 
                      color="#1a1a1a" 
                    />
                  </View>
                  
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventLabel}>Title:</Text>
                    <Text style={styles.eventText}>{eventDetails?.title}</Text>
                  </View>
                  
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventLabel}>Description:</Text>
                    <Text style={styles.eventText}>{eventDetails?.description || "No description provided"}</Text>
                  </View>
                  
                  <View style={styles.eventDetailSection}>
                    <Text style={styles.eventLabel}>Type:</Text>
                    <View style={styles.eventTypeTag}>
                      <MaterialIcons 
                        name={getEventTypeIcon(eventDetails?.type)} 
                        size={18} 
                        color="#fff" 
                        style={styles.smallIcon}
                      />
                      <Text style={styles.eventTypeText}>
                        {eventDetails?.type?.charAt(0).toUpperCase() + eventDetails?.type?.slice(1)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={[styles.button, styles.editButton]}
                      onPress={() => setIsEditing(true)}
                    >
                      <MaterialIcons name="edit" size={18} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Edit Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.unmarkButton]}
                      onPress={handleUnmarkDay}
                    >
                      <MaterialIcons name="delete" size={18} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Delete Event</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Edit/Create mode
                <View style={styles.form}>
                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Event Title <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons name="event" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter event title"
                        value={title}
                        onChangeText={setTitle}
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Description</Text>
                    <View style={styles.inputContainer}>
                      <MaterialIcons name="description" size={20} color="#666" style={[styles.inputIcon, {marginTop: Platform.OS === 'ios' ? 10 : 12}]} />
                      <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Enter event description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.fieldLabel}>Event Type</Text>
                    <TouchableOpacity 
                      style={styles.eventTypeButton}
                      onPress={openEventTypeModal}
                    >
                      <MaterialIcons name="category" size={20} color="#666" style={styles.inputIcon} />
                      <Text style={styles.eventTypeText}>{eventTypeName}</Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateDisplay}>
                    <MaterialIcons name="today" size={20} color="#666" />
                    <Text style={styles.dateText}>Date: {selectedDate}</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, styles.markButton]}
                    onPress={handleSubmit}
                  >
                    <MaterialIcons 
                      name={isEditing ? "update" : "add"} 
                      size={20} 
                      color="#fff" 
                      style={styles.buttonIcon} 
                    />
                    <Text style={styles.buttonText}>
                      {isEditing ? "Update Event" : "Create Event"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(false);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Event Type Selection Modal */}
      <Modal
        visible={showEventTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEventTypeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEventTypeModal(false)}>
          <View style={styles.typeModalContainer}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.typeModalContent}>
                <View style={styles.typeModalHeader}>
                  <Text style={styles.typeModalTitle}>Select Event Type</Text>
                  <TouchableOpacity onPress={() => setShowEventTypeModal(false)}>
                    <MaterialIcons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={eventTypes}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.typeOption,
                        eventType === item.value && styles.selectedTypeOption
                      ]}
                      onPress={() => handleSelectEventType(item)}
                    >
                      <View style={styles.typeOptionContent}>
                        <MaterialIcons 
                          name={getEventTypeIcon(item.value)} 
                          size={24} 
                          color={eventType === item.value ? "#fff" : "#666"} 
                          style={styles.typeOptionIcon} 
                        />
                        <Text style={[
                          styles.typeOptionText,
                          eventType === item.value && styles.selectedTypeOptionText
                        ]}>
                          {item.label}
                        </Text>
                      </View>
                      {eventType === item.value && (
                        <MaterialIcons name="check" size={22} color="#fff" />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    maxHeight: '85%',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  eventTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 12,
    height: 50,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  eventDetailsContainer: {
    padding: 20,
  },
  eventTypeIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  eventDetailSection: {
    marginBottom: 15,
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#666",
  },
  eventText: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    color: '#333',
  },
  eventTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  eventTypeText: {
    color: '#333',
    fontSize: 16,
    flex: 1,
  },
  smallIcon: {
    marginRight: 5,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  markButton: {
    backgroundColor: "#50cebb",
  },
  unmarkButton: {
    backgroundColor: "#ff6b6b",
  },
  editButton: {
    backgroundColor: '#2196F3',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  // Type selection modal styles
  typeModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  typeModalContent: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  typeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  typeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  typeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeOptionIcon: {
    marginRight: 12,
  },
  selectedTypeOption: {
    backgroundColor: '#1a1a1a',
  },
  typeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTypeOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
}); 