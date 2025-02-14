import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function TabLayout() {

  return (
    <>
    <Tabs
      screenOptions={{
      }}>
         <Tabs.Screen
        name="index"
        options={{
          href: null,
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          headerShown : false
        }}
      />
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
          headerShown : false
        }}
      />
      <Tabs.Screen
        name="work"
        options={{
          title: 'work',
          tabBarIcon: ({color}) => <MaterialIcons name="work" size={24} color={color} />,
          headerShown : false
        }}
      />
    </Tabs>
    </>
  );
}
