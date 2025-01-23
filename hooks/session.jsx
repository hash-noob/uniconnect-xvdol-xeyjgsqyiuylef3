import { useContext, createContext, useState, useEffect } from 'react'
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
                const credentials = JSON.stringify({email,password})
                console.log("credentials string: "+credentials)
              await SecureStore.setItemAsync('userToken',credentials)
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