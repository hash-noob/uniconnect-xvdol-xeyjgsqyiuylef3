import { useContext, createContext, useState, Children, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { warmUpAsync } from 'expo-web-browser';

const AuthContext = createContext(
    {
        signIn: (credentials) => Promise.resolve(false),
        signOut: ()=> Promise.resolve(false),
        session : null,
        isLoading : false,
        error : null
    }
);

const useSession = async ()=>{
    const value = useContext(AuthContext)
    await checkLocal()
    if(!value){
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
    return value;
}

//checks if the credentials are available locally
async function checkLocal(){
    const value = await SecureStore.getItemAsync('userToken');
    if(!value)  return false;

    await signIn(value)
    return true;
}

const SessionProvider = ({children})=>{
    const [session,setSession] = useState(null)
    const [error,setError] = useState(null)
    const [isLoading,setLoading] = useState(true)

    useEffect(
         () => {
            const wrapper = async ()=>{
                try{
                const value = await SecureStore.getItemAsync('userToken');
                if(!value)  return;
                setSession(value);
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
            // API call to the backend for authentication
            // const response = await axios.post(`${process.env.EXPO_PUBLIC_DEVICE_IP}/api/auth/login`, {
            //   email,
            //   password,
            // });
            const response = {
                data : {
                    success : true,
                    user : {email,password}
                }
            }

            if (response.data.success) {
              const user = response.data.user;
              // Store the session details in local storage
              setSession(user);
              // Storing the credentials to local device
              await SecureStore.setItemAsync('userToken',{ email ,password })
              setError(null)
              return true;
            } else {
              setError('Invalid credentials:'+ response.data.message);
              console.log('Invalid credentials')
              return false;
            }
          } catch (error) {
            setError('Error during sign-in:' + error.message || error);
            console.log(error)
            return false;
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