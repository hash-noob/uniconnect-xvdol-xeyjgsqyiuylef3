import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "react-native-paper";

export default function StudentWorkScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual data from your backend
  const assignments = [
    {
      id: 1,
      title: "Data Structures Assignment",
      subject: "Computer Science",
      dueDate: "2024-03-25",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2024-03-28",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      title: "Mathematics Quiz",
      subject: "Mathematics",
      dueDate: "2024-03-30",
      status: "completed",
      priority: "low",
    },
  ];

  const events = [
    {
      id: 1,
      title: "Mid-Term Examination",
      date: "2024-03-28",
      time: "10:00 AM",
      type: "exam",
    },
    {
      id: 2,
      title: "Project Presentation",
      date: "2024-04-01",
      time: "02:00 PM",
      type: "presentation",
    },
    {
      id: 3,
      title: "Guest Lecture on AI",
      date: "2024-04-05",
      time: "11:30 AM",
      type: "lecture",
    },
  ];

  const studyResources = [
    {
      id: 1,
      title: "Data Structures Notes",
      type: "pdf",
      subject: "Computer Science",
      size: "2.5 MB",
    },
    {
      id: 2,
      title: "Physics Formulas",
      type: "doc",
      subject: "Physics",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "Math Practice Problems",
      type: "pdf",
      subject: "Mathematics",
      size: "3.2 MB",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#fb923c";
      case "low":
        return "#22c55e";
      default:
        return "#666666";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "exam":
        return "edit-document";
      case "presentation":
        return "present-to-all";
      case "lecture":
        return "person";
      default:
        return "event";
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return "picture-as-pdf";
      case "doc":
        return "article";
      default:
        return "insert-drive-file";
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Pending Assignments</Text>
          {assignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.id}
              style={styles.assignmentItem}
              onPress={() => console.log("Assignment pressed:", assignment.id)}
            >
              <View style={styles.assignmentHeader}>
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(assignment.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {assignment.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.subjectText}>{assignment.subject}</Text>
              <View style={styles.assignmentFooter}>
                <Text style={styles.dueDate}>Due: {assignment.dueDate}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color:
                        assignment.status === "completed"
                          ? "#22c55e"
                          : "#ef4444",
                    },
                  ]}
                >
                  {assignment.status.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <MaterialIcons
                name={getEventIcon(event.type)}
                size={24}
                color="#1a1a1a"
                style={styles.eventIcon}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDateTime}>
                  {event.date} at {event.time}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Study Resources</Text>
          {studyResources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceItem}
              onPress={() => console.log("Resource pressed:", resource.id)}
            >
              <MaterialIcons
                name={getFileIcon(resource.type)}
                size={24}
                color="#1a1a1a"
                style={styles.resourceIcon}
              />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceSubject}>{resource.subject}</Text>
              </View>
              <View style={styles.resourceMeta}>
                <Text style={styles.resourceType}>
                  {resource.type.toUpperCase()}
                </Text>
                <Text style={styles.resourceSize}>{resource.size}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  assignmentItem: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  assignmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  subjectText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  assignmentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    color: "#666666",
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 12,
  },
  eventIcon: {
    marginRight: 16,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  eventDateTime: {
    fontSize: 14,
    color: "#666666",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 12,
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  resourceSubject: {
    fontSize: 14,
    color: "#666666",
  },
  resourceMeta: {
    alignItems: "flex-end",
  },
  resourceType: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  resourceSize: {
    fontSize: 12,
    color: "#666666",
  },
});
