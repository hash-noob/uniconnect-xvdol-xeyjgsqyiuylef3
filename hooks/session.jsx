import { useContext, createContext, useState, useEffect } from 'react'
import { Alert } from 'react-native';
import axios from 'axios'
import {url} from '@/constants/AppContants'
import * as SecureStore from 'expo-secure-store'

const AuthContext = createContext(
    {
        signIn: (credentials) => Promise.resolve(false),
        signOut: ()=> Promise.resolve(false),
        session : null,
        isLoading : false,
        error : null
    }
);

const useSession =  ()=>{
    const value = useContext(AuthContext)
    if(!value){
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
    return value;
}

//checks if the credentials are available locally

const SessionProvider = ({children})=>{
    const [session,setSession] = useState(null)
    const [error,setError] = useState(null)
    const [isLoading,setLoading] = useState(true)

    useEffect(
         () => {
            const wrapper = async ()=>{
                try{
                    console.log("Chcecking for credentials")
                const value = await SecureStore.getItemAsync('userToken');
                if(!value)  return;
                    setSession(JSON.parse(value));
                }
                catch(error){
                    console.log(error)
                }
                finally{
                    setLoading(false)
                }
            }
            wrapper()
        }
    ,[])

    const signIn = async ({email, password})=>{
        setLoading(true)
        try {
            //API call to the backend for authentication
            console.log(email + " " + password)
            const response = await axios.post(`${url}/api/auth/login`, {
              email,
              password,
            });

            const { success, message, token, user } = response.data;
            console.log(success + ": " + message)
            if (success) {
              // Store the session details in local storage
              setSession(user);
              // Storing the credentials to local device
                const credentials = JSON.stringify({email,password})
                console.log("credentials string: "+credentials)
              await SecureStore.setItemAsync('userToken',credentials)
              setError(null)
              return { success: true };
            } else {
              setError('Invalid credentials:'+ message);
              console.log('Invalid credentials')
              return { success: false, message: message || 'Invalid credentials' };
            }
          } catch (error) {
            setError('Error during sign-in:' + error.message || error);
            // Handle errors based on HTTP status code
            if (error.response) {
                const status = error.response.status;
                console.log(status)
                //console.error('Error response:', error.response);
        
                if (status === 400) {
                    Alert.alert('Login Failed', 'Email and password are required');
                } else if (status === 401) {
                    Alert.alert('Login Failed', 'Invalid email or password');
                } else if (status === 500) {
                    Alert.alert('Server Error', 'An internal server error occurred. Please try again later.');
                } else {
                    Alert.alert('Error', error.response.data.message || 'An unexpected error occurred.');
                }
            } else if (error.request) {
                console.error('Error request:', error.request);
                Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection.');
            } else {
                console.error('Error:', error.message);
                Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            }
            return { success:false, message:error.response.data.message };
          }
          finally{
            setLoading(false)
          }
    }

    const signOut = async () => {
        setLoading(true)
        try{
            setSession(null);
            await SecureStore.deleteItemAsync('userToken');
            return true;
        }
        catch(error){
            setError('Trouble logging out');
            console.log(error)
            return false;
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                error
            }}
            >
                {children}
            </AuthContext.Provider>
    )

}

export {useSession};
export {SessionProvider};