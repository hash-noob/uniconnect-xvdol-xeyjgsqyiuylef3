import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menteeData = [
  {
    id: "1",
    name: "Ramesh Kumar",
    course: "Computer Science",
    year: "3rd Year",
    phone: "+91 9876543210",
    email: "ramesh.k@example.com"
  },
  {
    id: "2",
    name: "Vani Vathsala",
    course: "Computer Science",
    year: "4th Year",
    phone: "+91 9876543211",
    email: "vani.v@example.com"
  },
  {
    id: "3",
    name: "Raghava",
    course: "Computer Science",
    year: "4th Year",
    phone: "+91 9876543212",
    email: "raghava@example.com"
  },
  // Add more mentees as needed
];

export default function Mentees() {
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderMentee = ({ item }) => (
    <View style={styles.menteeCard}>
      <View style={styles.menteeHeader}>
        <Text style={styles.menteeName}>{item.name}</Text>
      </View>
      <View style={styles.menteeInfo}>
        <Text style={styles.menteeDetails}><Text style={styles.detailLabel}>Course:</Text> {item.course}</Text>
        <Text style={styles.menteeDetails}><Text style={styles.detailLabel}>Year:</Text> {item.year}</Text>
        <View style={styles.contactContainer}>
          <Text style={styles.detailLabel}>Contact:</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.phoneNumber}>{item.phone}</Text>
            <View style={styles.contactActions}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleCall(item.phone.replace(/\s/g, ''))}
              >
                <MaterialIcons name="call" size={20} color="#1a1a1a" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleEmail(item.email)}
              >
                <MaterialIcons name="email" size={20} color="#1a1a1a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={menteeData}
        renderItem={renderMentee}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  menteeCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menteeHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  menteeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  menteeInfo: {
    gap: 8,
  },
  menteeDetails: {
    fontSize: 15,
    color: "#666",
  },
  detailLabel: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  contactContainer: {
    marginTop: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#666',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    backgroundColor: '#e5e7eb',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
