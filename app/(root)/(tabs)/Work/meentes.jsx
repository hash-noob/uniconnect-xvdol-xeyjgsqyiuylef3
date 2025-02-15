import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const menteeData = [
  {
    id: "1",
    name: "John Doe",
    course: "Computer Science",
    year: "3rd Year",
  },
  {
    id: "2",
    name: "Jane Smith",
    course: "Electronics",
    year: "2nd Year",
  },
  // Add more mentees as needed
];

export default function Mentees() {
  const renderMentee = ({ item }) => (
    <TouchableOpacity
      style={styles.menteeCard}
      onPress={() => router.push("/Work/StudentProfile")}
    >
      <Text style={styles.menteeName}>{item.name}</Text>
      <Text style={styles.menteeDetails}>{item.course}</Text>
      <Text style={styles.menteeDetails}>{item.year}</Text>
    </TouchableOpacity>
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
  },
  listContainer: {
    padding: 16,
  },
  menteeCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menteeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menteeDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
});
