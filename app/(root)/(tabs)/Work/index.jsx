import FacultyWorkScreen from "@/components/faculty/WorkScreen";
import StudentWorkScreen from "@/components/student/WorkScreen";
import { useSession } from "@/hooks/session";

export default function Work() {
  const { session } = useSession();
  const isFaculty = session?.role === "faculty";
  console.log(session)
  console.log(isFaculty)

  return isFaculty ? <FacultyWorkScreen /> : <StudentWorkScreen />;
}
