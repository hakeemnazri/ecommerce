import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, couponUsage, getCartItems, selectCart, selectCoupon, subtotal, total } from "../redux/cartSlice"
import { useCallback, useState } from "react"

export const useGetCartItems = () =>{
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const getCartHook = useCallback(async() =>{
        setLoading(true)
        try {
            const res = await fetch(`/api/cart`)
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(getCartItems(data))
        } catch (error) {
            setLoading(false)
        }
    }, [dispatch]) 
    return {getCartHook, loading}
}

export const useAddToCart = () =>{
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const addToCartHook = async(product) =>{
        setLoading(true)
        console.log(product)
        try {
            const res = await fetch(`/api/cart`,{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({productId: product._id})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            } 
            dispatch(addToCart(data))
            toast.success("added to cart successfully")
        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }
    return {addToCartHook, loading}
}

export const useRemoveFromCart = () =>{
    const dispatch = useDispatch()
    const removeFromCartHook = async(id) =>{
        try {
            const res = await fetch(`/api/cart`,{
                method: 'DELETE',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({productId: id})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(getCartItems(data))
        } catch (error) {
            toast.error(error.message)
        }
    }
    return {removeFromCartHook}
}

export const useUpdateQuantity = () =>{
    const dispatch = useDispatch()
    const updateQuantityHook= async(id, quantity) =>{

        try {
            const res = await fetch(`/api/cart/${id}`,{
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({quantity})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(getCartItems(data))
        } catch (error) {
            toast.error(error.message)
        }
    }
    return { updateQuantityHook }
}

export const useGetCoupon = () =>{
    const dispatch = useDispatch()
    const getCouponHook= useCallback( async() =>{

        try {
            const res = await fetch(`/api/coupons`)
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(couponUsage(data))
        } catch (error) {
            toast.error(error.message)
        }
    },[dispatch])
    return { getCouponHook }
}

export const useValidateCoupon = () =>{

    const validateCoupon = async(code) =>{
        try {
            const res = await fetch(`/api/coupons/validate`,{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({code})
            })
            const data = res.json()
            if(data.error){
                throw new Error(data.error)
            }
            console.log(data)
            toast.success("Coupon applied successfully")
        } catch (error) {
            toast.error(error.message)
        }
    }
    return { validateCoupon }
}

export const useRemoveCoupon = () =>{

    const RemoveCouponHook = async(code) =>{
        try {
            console.log(data)
            toast.success("Coupon applied successfully")
        } catch (error) {
            toast.error(error.message)
        }
    }
    return { RemoveCouponHook }
}

export const useCalculateTotal = () =>{
    const cart = useSelector(selectCart)
    const coupon = useSelector(selectCoupon)
    const dispatch = useDispatch()
    let subtotalPrice = 0
    let totalPrice = 0
    const calculateTotal = () =>{
        try {
            subtotalPrice = cart?.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

            if(coupon){
                totalPrice = subtotalPrice - (coupon?.discountPrecentage/100) * subtotalPrice
            }else{
                totalPrice = subtotalPrice
            }
        
            dispatch(subtotal(subtotalPrice))
            dispatch(total(totalPrice))
        } catch (error) {
            console.log("Error in calculateTotal hook: ", error.message)
            toast.error(error.message)
        }
    }

    return {calculateTotal}
}



