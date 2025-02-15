import React from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function WorkModals({
  modalVisible,
  setModalVisible,
  isMarkedDayModal,
  eventText,
  setEventText,
  handleMarkDay,
  handleUnmarkDay,
}) {
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
            {isMarkedDayModal ? "Event Details" : "Add New Event"}
          </Text>

          {isMarkedDayModal ? (
            // Marked day modal content
            <>
              <Text style={styles.eventText}>{eventText}</Text>
              <TouchableOpacity
                style={[styles.button, styles.unmarkButton]}
                onPress={handleUnmarkDay}
              >
                <Text style={styles.buttonText}>Unmark Day</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Unmarked day modal content
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter event details"
                value={eventText}
                onChangeText={setEventText}
                multiline
              />
              <TouchableOpacity
                style={[styles.button, styles.markButton]}
                onPress={handleMarkDay}
              >
                <Text style={styles.buttonText}>Mark Day</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
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
    minHeight: 100,
    textAlignVertical: "top",
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
}); 