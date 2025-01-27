import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Picker} from 'react-native-picker/picker'

export default function Notice() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [recipient, setRecipient] = useState('Mentors');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), text: inputText, recipient },
      ]);
      setInputText('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageBubble}>
      <Text style={styles.recipientText}>{item.recipient}:</Text>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
          inverted // Displays the latest message at the bottom
        />

        {/* Recipient Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Sending to:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={recipient}
              onValueChange={(itemValue) => setRecipient(itemValue)}
              style={styles.picker}
              mode="dropdown"
            >
              <Picker.Item label="Mentor Students" value="Mentors" />
              <Picker.Item label="Class Students" value="Class" />
            </Picker>
          </View>
        </View>

        {/* Input and Send Button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Type your message to ${recipient}...`}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            accessibilityLabel="Send message"
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  chatContainer: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#e6e6e6',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  recipientText: {
    fontSize: 12,
    color: '#007bff', // Blue text for recipient
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  dropdownLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    flex: 1,
    height: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
