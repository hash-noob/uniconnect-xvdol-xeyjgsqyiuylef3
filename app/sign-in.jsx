import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSession } from '@/hooks/session';
import { TextInput } from 'react-native-paper';
import { router } from 'expo-router';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility

  const { signIn,error } = useSession();

  const handleSignIn = async ()=>{
      if(!email || !password){
        Alert.alert('Required', 'Please fill in all fields')

      }
      else{
        const { success, message } = await signIn({ email, password });
        console.log("success:" + success)
        if(success){
          console.log("Redirtecting...");
          router.replace('/')
        }
        else{
          console.log('login failed: ', message)
        }
      }
      
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        underlineColor="transparent" 
        cursorColor='black'
        activeUnderlineColor="transparent"
        theme={{
          roundness: 15, 
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!isPasswordVisible} 
        value={password}
        onChangeText={setPassword}
        underlineColor="transparent" 
        activeUnderlineColor="transparent"
        cursorColor='black'
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? 'eye' : 'eye-off'} 
            onPress={() => setPasswordVisible(!isPasswordVisible)}
          />
        }
        theme={{
          roundness: 15, 
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    padding: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 14,
  },
});