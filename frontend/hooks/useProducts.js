import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createProduct, fetchAllProduct, fetchAllProductByCategory, toggleFeaturedProduct } from "../redux/productSlice"
import toast from "react-hot-toast"


export const useCreateProduct = () =>{
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const createProductHook = async ({name, description, price, image, category}) => {

        setLoading(true)
        
        try {
            const res = await fetch(`/api/products`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name, description, price, image, category})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            console.log(data)
            dispatch(createProduct(data))
            
        } catch (error) {
            console.log("Error in createProduct hook: ", error.message)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {createProductHook, loading}
}

export const useFetchAllProducts = () =>{
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const fetchAllProductsHook = async () => {

        setLoading(true)
        
        try {
            const res = await fetch(`/api/products`)
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(fetchAllProduct(data))     
        } catch (error) {
            console.log("Error in fetchAllProducts hook: ", error.message)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {fetchAllProductsHook, loading}
}

export const useDeleteProduct = () => {
    const [loadingDelete, setLoading] = useState(false)
    
    const deleteProductHook = async(id) =>{
        setLoading(true)
        try {
            
            const res = await fetch(`api/products/${id}`,{
                method: 'DELETE',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            toast.success(data.message)
        } catch (error) {
            console.log("Error in deleteProduct hook: ", error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return { deleteProductHook, loadingDelete }
}

export const useToggleFeaturedProductt = () => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const toggleFeaturedProductHook = async(id) =>{
        setLoading(true)
        try {
            
            const res = await fetch(`api/products/${id}`,{
                method: 'PATCH',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({}),
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(toggleFeaturedProduct(data))
        } catch (error) {
            console.log("Error in toggleFeaturedProduct hook: ", error.message)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }
    return { toggleFeaturedProductHook, loading }
}

export const useGetProductsByCategory = () =>{
    const[ loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const GetProductsByCategory = useCallback(async(category)=>{
        setLoading(true)
        try {
            const res = await fetch(`/api/products/category/${category}`)
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(fetchAllProductByCategory(data))
        } catch (error) {
            console.log("Error in GetProductsByCategory hook: ", error.message)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    },[dispatch])
    return {GetProductsByCategory, loading}
}

export const useGetFeaturedProducts = () =>{
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const getFeaturedProducts = useCallback(async () => {

        setLoading(true)
        
        try {
            const res = await fetch(`/api/products/featured`)
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            console.log(data)
            // dispatch(fetchFeaturedProducts(data))
        } catch (error) {
            console.log("Error in fetchAllProducts hook: ", error.message)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }, [dispatch])
    return {getFeaturedProducts, loading}
}

