import { url } from "@/constants/AppContants";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Keyboard,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars'; // Import Calendar component

const LeaveApplicationForm = ({ visible, onClose, userId, onLeaveSubmitted }) => {
  const [leaveType, setLeaveType] = useState('casual');
  const [leaveTypeName, setLeaveTypeName] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMode, setCalendarMode] = useState('start'); // 'start' or 'end'
  const [showLeaveTypeModal, setShowLeaveTypeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Format date for display in the UI (YYYY-MM-DD)
  const formatDisplayDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Format date for API request - matching the format expected by the backend
  const formatApiDate = (date) => {
    return date.toLocaleDateString('en-IN'); // This matches the format used in the original implementation
  };

  const getDateStringForCalendar = (date) => {
    return formatDisplayDate(date); // YYYY-MM-DD format for calendar
  };

  const validateForm = () => {
    let formErrors = {};
    
    if (!reason.trim()) {
      formErrors.reason = 'Reason is required';
    }
    
    if (endDate < startDate) {
      formErrors.date = 'End date cannot be before start date';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Dismiss keyboard on submit
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create leave data object - make sure the format matches what the API expects
      const leaveData = {
        userId,
        type: leaveType,
        startDate: formatApiDate(startDate),
        endDate: formatApiDate(endDate),
        reason: reason,
        status: 'pending'  // Ensuring the status is set
      };
      
      console.log('Submitting leave data:', leaveData);
      
      // Make the API request
      const response = await axios.post(`${url}/api/faculty/leaves`, leaveData);
      const newLeave = response.data;
      
      setLoading(false);
      onClose();
      
      // Reset form
      setLeaveType('casual');
      setLeaveTypeName('Casual Leave');
      setStartDate(new Date());
      setEndDate(new Date());
      setReason('');
      setErrors({});
      
      // Call the callback with the new leave data
      if (onLeaveSubmitted) {
        onLeaveSubmitted(newLeave);
      }
      
      Alert.alert('Success', 'Leave application submitted successfully');
    } catch (error) {
      setLoading(false);
      console.error('Error submitting leave application:', error);
      // Check if there's a specific error message from the server
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         'Failed to submit leave application. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const openCalendar = (mode) => {
    Keyboard.dismiss(); // Dismiss keyboard when opening calendar
    setCalendarMode(mode);
    setShowCalendarModal(true);
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(day.dateString);
    
    if (calendarMode === 'start') {
      setStartDate(selectedDate);
      
      // If end date is before start date, set end date to start date
      if (endDate < selectedDate) {
        setEndDate(selectedDate);
      }
    } else {
      setEndDate(selectedDate);
    }
    
    setShowCalendarModal(false);
  };

  const leaveTypes = [
    { label: 'Casual Leave', value: 'casual' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'Vacation', value: 'vacation' },
    { label: 'Personal Leave', value: 'personal' },
    { label: 'Other', value: 'other' }
  ];

  const handleSelectLeaveType = (type) => {
    setLeaveType(type.value);
    setLeaveTypeName(type.label);
    setShowLeaveTypeModal(false);
  };

  const openLeaveTypeModal = () => {
    Keyboard.dismiss(); // Dismiss keyboard when opening leave type modal
    setShowLeaveTypeModal(true);
  };

  // Generate marked dates for calendar
  const getMarkedDates = () => {
    const startDateStr = getDateStringForCalendar(startDate);
    const endDateStr = getDateStringForCalendar(endDate);
    
    let markedDates = {};
    
    if (calendarMode === 'start') {
      markedDates[startDateStr] = { selected: true, selectedColor: '#1a1a1a' };
    } else {
      // For end date selection, mark the range
      const startMs = startDate.getTime();
      const endMs = endDate.getTime();
      
      markedDates[startDateStr] = { 
        selected: true, 
        startingDay: true, 
        color: '#1a1a1a' 
      };
      
      markedDates[endDateStr] = { 
        selected: true, 
        endingDay: true,
        color: '#1a1a1a' 
      };
      
      // If there are dates in between, mark them too
      if (endDateStr !== startDateStr) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);
        
        while (currentDate.getTime() < endDate.getTime()) {
          const dateStr = getDateStringForCalendar(currentDate);
          markedDates[dateStr] = { 
            selected: true, 
            color: '#d3d3d3' 
          };
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
    
    return markedDates;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Apply for Leave</Text>
              <TouchableOpacity 
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }} 
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.form}>
                  {/* Leave Type */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Leave Type</Text>
                    <TouchableOpacity 
                      style={styles.leaveTypeButton}
                      onPress={openLeaveTypeModal}
                    >
                      <MaterialIcons name="event-note" size={20} color="#666" style={styles.inputIcon} />
                      <Text style={styles.leaveTypeText}>{leaveTypeName}</Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </TouchableOpacity>
                  </View>

                  {/* Date Range */}
                  <View style={styles.dateContainer}>
                    {/* Start Date */}
                    <View style={styles.dateField}>
                      <Text style={styles.label}>Start Date</Text>
                      <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => openCalendar('start')}
                      >
                        <MaterialIcons name="calendar-today" size={20} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateText}>{formatDisplayDate(startDate)}</Text>
                      </TouchableOpacity>
                    </View>

                    {/* End Date */}
                    <View style={styles.dateField}>
                      <Text style={styles.label}>End Date</Text>
                      <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => openCalendar('end')}
                      >
                        <MaterialIcons name="calendar-today" size={20} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateText}>{formatDisplayDate(endDate)}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {errors.date && (
                    <Text style={styles.errorText}>{errors.date}</Text>
                  )}

                  {/* Reason */}
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Reason for Leave <Text style={styles.required}>*</Text></Text>
                    <View style={[styles.inputContainer, errors.reason && styles.inputError]}>
                      <MaterialIcons name="description" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.reasonInput}
                        placeholder="Provide detailed reason for your leave request..."
                        value={reason}
                        onChangeText={(text) => {
                          setReason(text);
                          if (text.trim()) {
                            setErrors({...errors, reason: null});
                          }
                        }}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                    {errors.reason && (
                      <Text style={styles.errorText}>{errors.reason}</Text>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons name="paper-plane" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>Submit Application</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCalendarModal(false)}>
          <View style={styles.calendarModalContainer}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.calendarModalContent}>
                <View style={styles.calendarModalHeader}>
                  <Text style={styles.calendarModalTitle}>
                    Select {calendarMode === 'start' ? 'Start' : 'End'} Date
                  </Text>
                  <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                    <MaterialIcons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <Calendar
                  style={styles.calendar}
                  current={getDateStringForCalendar(calendarMode === 'start' ? startDate : endDate)}
                  minDate={calendarMode === 'end' ? getDateStringForCalendar(startDate) : getDateStringForCalendar(new Date())}
                  onDayPress={handleDateSelect}
                  markedDates={getMarkedDates()}
                  markingType={calendarMode === 'end' ? 'period' : 'dot'}
                  theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: "#ffffff",
                    textSectionTitleColor: "#b6c1cd",
                    selectedDayBackgroundColor: "#1a1a1a",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#1a1a1a",
                    dayTextColor: "#2d4150",
                    textDisabledColor: "#d9e1e8",
                    arrowColor: "#1a1a1a",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Leave Type Selection Modal */}
      <Modal
        visible={showLeaveTypeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveTypeModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLeaveTypeModal(false)}>
          <View style={styles.typeModalContainer}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.typeModalContent}>
                <View style={styles.typeModalHeader}>
                  <Text style={styles.typeModalTitle}>Select Leave Type</Text>
                  <TouchableOpacity onPress={() => setShowLeaveTypeModal(false)}>
                    <MaterialIcons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={leaveTypes}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={[
                        styles.typeOption,
                        leaveType === item.value && styles.selectedTypeOption
                      ]}
                      onPress={() => handleSelectLeaveType(item)}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        leaveType === item.value && styles.selectedTypeOptionText
                      ]}>
                        {item.label}
                      </Text>
                      {leaveType === item.value && (
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
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  leaveTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 12,
    height: 50,
  },
  leaveTypeText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 5,
    alignItems: 'flex-start',
  },
  inputError: {
    borderColor: 'red',
  },
  inputIcon: {
    marginHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? 10 : 12,
  },
  reasonInput: {
    flex: 1,
    padding: 10,
    color: '#333',
    minHeight: 100,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateField: {
    width: '48%',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 12,
    height: 50,
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  calendarModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  calendarModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendar: {
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
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

export default LeaveApplicationForm; 