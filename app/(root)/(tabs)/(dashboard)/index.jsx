import FacultyHomeScreen from "@/components/faculty/HomeScreen";
import StudentHomeScreen from "@/components/student/HomeScreen";
import { useSession } from "@/hooks/session";

export default function HomeScreen() {
  const { session } = useSession();

  return session.role === "faculty" ? (
    <FacultyHomeScreen />
  ) : (
    <StudentHomeScreen />
  );
}
