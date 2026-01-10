import { createContext , useCallback, useContext, useEffect, useRef, useState } from "react";
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
    const [reviews , setReviews] = useState({
        user_reviews:[],
        averageRating: 0
    })

    /*Location get */
    const isAddressInitial = useRef(false)

    const fetchAddress = useCallback( async () => {
        if (!user) return;
        startLoading();
        try {
            isAddressInitial.current = true
            const response = await api.get('/location/get');

            if(response.data.success){
                setAddress(response.data.user_address);
            }
        } catch (error) {
            console.log(error)
            isAddressInitial.current = false;
        } finally {
            stopLoading();
        }
        },[user]);

    useEffect(() => {
        if (!user || isAddressInitial.current) return
        fetchAddress();
    }, [user]); 

    /*To fetch profile */
    useEffect(() => {
        if(!user || profile) return
        fetchProfile()
    }, [user , profile]);

    /*Fetch profile function */
    const fetchProfile = useCallback(async () => {
        if(!user || profile) return
        startLoading()
        try {
            const response = await api.get('/profile/get')

            const user_details = response.data.user_details

            setProfile(user_details)

            console.log('helo')
        } catch (error) {
            console.log('Error' , error)
        } finally{
            stopLoading()
        }
    }, [user , profile])

    {/* Profile Edit function */}
    const profileEdit = useCallback(async (name , mobile) => {
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
    },[ startLoading , stopLoading])

    {/*Location / Addresses function*/}
    const locationDelete = useCallback(async() => {
        startLoading()
        try {
            const response = await api.post('/location/delete' ,{} )
            setAddress(null)
            return response.data
        } catch (error) {
            console.log(error)
            return error
        } finally{
            stopLoading()
        }
    },[startLoading , stopLoading])

    {/*Reviews function*/}

    {/* Get Review Function */}
    const reviewsGet = useCallback(async (itemId) => {
        startLoading()
        try {
            const response = await api.post('/review/get' , { itemId })
            
            if(response.data.success){
                setReviews({user_reviews :response.data.user_reviews,
                    averageRating: response.data.averageRating
                })
            }
            console.log('hi')
        } catch (error) {
            return error.message
        } finally{
            stopLoading()
        }
    },[])

    {/*Post review function */}
    const reviewPost = useCallback(async (itemId , rating , comment , isVerifiedPurchase) =>{
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
    },[startLoading , stopLoading])

    return <profileContext.Provider value={{profile , address , reviews , setReviews , reviewsGet , reviewPost , setAddress , setProfile , profileEdit , locationDelete}}>
        {children}
    </profileContext.Provider>
}

export const useProf = () => useContext(profileContext)