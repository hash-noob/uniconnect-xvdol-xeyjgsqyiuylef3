import { Stack } from "expo-router";

export default function WorkLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Work",
          headerShown: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="meentes"
        options={{
          title: "My Mentees",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
}
