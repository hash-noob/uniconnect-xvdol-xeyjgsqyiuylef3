import FacultyHomeScreen from "@/components/faculty/HomeScreen"
import StudentHomeScreen from "@/components/student/HomeScreen";
import { useSession } from "@/hooks/session";

export default function HomeScreen() {
  const { session } = useSession();
  const isFaculty = session?.user?.role === "faculty";

  return isFaculty ? <FacultyHomeScreen />: <StudentHomeScreen />;
}
