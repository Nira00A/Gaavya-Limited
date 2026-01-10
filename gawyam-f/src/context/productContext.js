import { useContext , createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../axiosApi/api";
import { useLoading } from "./loadingContext";

const productContext = createContext()

export const ProductProvider = ({children}) => {
    const [products , setProducts] = useState(null)
    const [categories , setCategories] = useState(null)
    const [prodLoading , setProdLoading] = useState(true)
    const { startLoading , stopLoading} = useLoading()

    const hasFetchedInitial = useRef(false);

    const fetchProducts = useCallback(async () => {
        if (products) return

        try {
            const result = await api.get('/product/get/all')

            const data = result.data

            if(data.success){
                setProducts(data.user_products_all || [])
                return data.text
            }
        } catch (error) {
            return error.response.data.error
        } finally{
            setProdLoading(false)
        }
    },[products])

    const fetchCategories = useCallback(async() => {
        if (categories) return

        try {
            const result = await api.get('/category/get/all')

            const data = result.data

            if(data.success){
                setCategories(data.user_categories_all || [])
                return data.text
            }
        } catch (error) {
            return error.response.data.error
        } finally{
            setProdLoading(false)
        }
    },[categories])

    const getProduct = useCallback(async (id) => {
        startLoading()
        try {
            const result = await api.get(`/product/${id}`);
            const data = result.data;

            if(data.success){
                return data.user_product; 
            }
        } catch (error) {
            console.error("API Error:", error);
            throw error; 
        } finally{
            stopLoading()
        }
    },[]);

    useEffect(() => {
        if (!hasFetchedInitial.current) {
            hasFetchedInitial.current = true;
            fetchProducts();
            fetchCategories();
        }
    }, [fetchProducts, fetchCategories]);

    return (
    <productContext.Provider value={{products , prodLoading , categories , getProduct , fetchProducts}}>
        {children}
    </productContext.Provider>
    )
}

export const useProd = () => useContext(productContext)