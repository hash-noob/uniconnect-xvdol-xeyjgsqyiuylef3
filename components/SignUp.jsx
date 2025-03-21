import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    // Handle sign-up logic here
    // For example, navigate to the home page after successful sign-up
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#bdc3c7" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#bdc3c7" secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#bdc3c7" secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} color="#3498db" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Simple white background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ecf0f1',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#2c3e50',
    width: '80%',
  },
});

export default SignUp; 