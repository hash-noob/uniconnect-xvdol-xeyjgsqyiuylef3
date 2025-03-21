import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from '../app/sign-in';
import SignUp from '../components/SignUp';
import HomePage from '../components/HomePage';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 