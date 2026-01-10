import api from '../axiosApi/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createContext , useContext } from 'react'
import { useLoading } from './loadingContext'
import { useProf } from './profileContext'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user , setUser] = useState(null)
    const { profile } = useProf
    const { startLoading , stopLoading } = useLoading()
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const hasCheckedInitial = useRef(false);

    useEffect(() => {
        if (user || hasCheckedInitial.current) return

        const initAuth =  async() => {
            hasCheckedInitial.current = true
            try {
                const res = await api.get('/auth/check');
                setUser(res.data.user);
            } catch (error){
                console.log(error)
                setUser(null);
            } finally {
                setIsAuthLoading(false); 
            }
        };
        initAuth();
    }, [user , profile]);

    const login = async (user_email, user_password) => {
        startLoading()
        try {
            if(!user_email || user_email.trim() === '' || !user_password || user_password.trim()=== ''){
                return ({
                    success: false,
                    text: 'Email or password is empty'
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(user_email)) {
                return {
                    success: false,
                    text: 'Please enter a valid email address'
                };
            }
                
            const response = await api.post('/login' , {user_email , user_password})

            const data = response.data

            setUser(data.user)

            return {
                success: data.success,
                text: 'Login successful!',
                user: data.user
            };
            
        } catch (error) {
            console.log("Context Error" , error)
        } finally{
            stopLoading()
        }
    }

    const register = async (user_email , user_name , user_password) => {
        startLoading()
        try {
            if(!user_email || user_email.trim() === '' || !user_password || user_password.trim()=== '' || user_name.trim() === ''){
                return ({
                    success: false,
                    text: 'Email or password is empty'
                })
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user_email)) {
                return {
                    success: false,
                    text: 'Please enter a valid email address'
                };
            }

            const response = await api.post('/register' , {user_email , user_name , user_password})
        
            const data = response.data

            if(data.success){
                setUser(data.user)
            }

            return {
                success: true,
                text: 'Successfully registered'
                };
        } catch (error) {
            console.log("Context Error" , error)
        } finally{
            stopLoading()
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout' ,{})
        } catch (error) {
            console.log(error.message)
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{login , register , logout , user , isAuthLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)