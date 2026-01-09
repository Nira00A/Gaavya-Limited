import { useContext , createContext, useState, useEffect } from "react";
import api from "../axiosApi/api";
import { useAuth } from "./authContext";

export const couponContext = createContext()

export const CouponProvider = ({children}) => {
    const [coupons , setCoupons] = useState([])
    const [couponLoading , setCouponLoading] = useState(true)
    const [couponOnCart , setCouponOnCart] = useState([])

    const { user } = useAuth()

    useEffect(() => {
        if(!user){
            setCoupons([])
            return
        }

        fetchCoupons()
    },[user])

    const fetchCoupons = async () => {
        try {
            const response = await api.get('/coupon')

            if(response.data.success){
                setCoupons(response.data.user_coupons_all || [])
            }
        } catch (error) {
            console.log(error.messsage)
        } finally{
            setCouponLoading(false)
        }
    }

    const checkAutoApply = async (totalAmount) => {
      try {
        const statusRes = await api.get('/coupon/eligible')
        const check = statusRes.data.eligible_for_coupon

        if(check){
            const couponRes = await api.get('/coupon');
            const coupons = couponRes.data.user_coupons_all || []

            const validCoupon = coupons.find(c => c.is_active && !c.is_used && new Date(c.expiry_date) > new Date())

            if(validCoupon){
                let discount = 0

                setCouponOnCart(validCoupon)

                if(validCoupon.discount_type === 'PERCENTAGE'){
                    discount = (totalAmount * validCoupon.discount_value) / 100
                } else{
                    discount = validCoupon.discount_value
                }

                return discount
            }

            return 0
        }

        return 0
      } catch (error) {
        console.error("Auto-coupon check failed", error);
        return 0; 
      } finally{
        setCouponLoading(false)
      }
    }

    return (
        <couponContext.Provider value={{coupons , couponLoading , couponOnCart , checkAutoApply}}>
            {children}
        </couponContext.Provider>
    )
}

export const useCoupon = () => useContext(couponContext)