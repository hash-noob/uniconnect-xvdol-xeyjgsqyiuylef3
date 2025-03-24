import React, { useEffect, useState } from "react";
import FacultyWorkScreen from "@/components/faculty/WorkScreen";
import StudentWorkScreen from "@/components/student/WorkScreen";
import { useSession } from "@/hooks/session";
import * as SecureStore from 'expo-secure-store';
import { View, Text, ActivityIndicator } from "react-native";

export default function Work() {
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [roleFromStorage, setRoleFromStorage] = useState(null);
  
  useEffect(() => {
    // Fallback to check role directly from SecureStore
    const checkRole = async () => {
      try {
        const role = await SecureStore.getItemAsync('role');
        console.log("Role from SecureStore:", role);
        setRoleFromStorage(role);
      } catch (err) {
        console.error("Error getting role from SecureStore:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkRole();
  }, []);
  
  console.log("Session in Work screen:", session);
  
  // Use role from session if available, otherwise use from storage
  const role = session?.role || roleFromStorage;
  const isFaculty = role === "faculty";
  console.log("Is faculty:", isFaculty, "Role:", role);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4158D0" />
      </View>
    );
  }
  
  if (!role) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text>Unable to determine user role. Please restart the app or log in again.</Text>
      </View>
    );
  }

  return isFaculty ? <FacultyWorkScreen /> : <StudentWorkScreen />;
}
