import { createContext , useContext, useEffect, useState } from "react";
import api from '../axiosApi/api'
import { useAuth } from "./authContext";
import { useLoading } from "./loadingContext";

export const profileContext = createContext()

export const ProfileProvider = ({children}) => {
    const { user } = useAuth()
    const { startLoading , stopLoading} = useLoading()
    const [profile , setProfile] = useState(null)

    /*Address UseStates*/
    const [address , setAddress] = useState()

    /*Reviews UseStates*/
    const [allReviews , setAllReviews] = useState()
    const [reviews , setReviews] = useState()

    useEffect(() => {
        fetchProfile()
    }, [user]);

    const fetchProfile = async () => {
        if(!user) return
        startLoading()
        try {
            const response = await api.get('/profile/get')

            const user_details = response.data.user_details

            setProfile(user_details)
        } catch (error) {
            console.log('Error' , error)
        } finally{
            stopLoading()
        }
    }

    const profileEdit = async (name , mobile) => {
        startLoading()
        try {
            const response = await api.post('/profile/edit' , {name , mobile})

            if (response.data.success) {
                const updatedUser = response.data.user_details;
                setProfile(updatedUser);
                fetchProfile()
                return response.data
            }
        } catch (error) {
            return error
        } finally{
            stopLoading()
        }
    }

    {/*Location / Addresses*/}

    const locationDelete = async() => {
        try {
            const response = await api.post('/location/delete' ,{} )
            setAddress(null)
            return response.data
        } catch (error) {
            console.log(error)
        } 
    }

    {/*Reviews*/}
    const reviewsGet = async (itemId) => {
        startLoading()
        try {
            const response = await api.post('/review/get' , { itemId })
            
            if(response.data.success){
                setReviews(response.data.user_reviews)
                return response.data
            }
        } catch (error) {
            console.log(error)
            return error.message
        } finally{
            stopLoading()
        }
    }

    const reviewPost = async (itemId , rating , comment , isVerifiedPurchase) =>{
        startLoading()
        try {
            const response = await api.post('/review/post' , { itemId , rating , comment , isVerifiedPurchase})
            
            if(response.data.success){
                return response.data
            }
        } catch (error) {
            console.log(error)
            return error.message
        } finally{
            stopLoading()
        }
    }

    return <profileContext.Provider value={{profile , address , reviews , setReviews , reviewsGet , reviewPost , setAddress , setProfile , profileEdit , locationDelete}}>
        {children}
    </profileContext.Provider>
}

export const useProf = () => useContext(profileContext)