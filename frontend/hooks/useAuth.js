import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { login, logout, signup } from '../redux/userSlice'

export const useSignup = ()=> {
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const signupHook = async ({name, email, password, confirmPassword}) => {
        if(password !== confirmPassword){
            return toast.error("Passwords don't match")
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/auth/signup`, {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({name, email, password})
            }
            )
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(signup(data.user))
            return toast.success(data.message)
        } catch (error) {
            console.log("Error in signup hook: ", error.message)
            return toast.error(error.message)
        }finally{
            setLoading(false)
        }


    }
    return {signupHook, loading}
}

export const useLogin = ()=> {
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loginHook = async (email, password) => {

        setLoading(true)
        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ email, password})
            }
            )
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(login(data.user))
            return toast.success(data.message)
        } catch (error) {
            console.log("Error in login hook: ", error.message)
            return toast.error(error.message)
        }finally{
            setLoading(false)
        }

    }
    return {loginHook, loading}
}

export const useCheckAuth = ()=>{
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [isAuth, setIsAuth] = useState(false)

    const checkAuth = useCallback(async() =>{
        setLoading(true)
        try {
            const res = await fetch("api/auth/profile")
            if(res.status === 401){
                setIsAuth(true)
                const res = await fetch("api/auth/refreshToken",{
                    method: "POST",
                    headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({})
                })
                setIsAuth(false)
            }
            const data = await res.json()
            if(data.error){ 
                throw new Error(data.error)
            }
            dispatch(login(data))
        } catch (error) {
            dispatch(login(null))
        }finally{
            setLoading(false)
        }
    },[dispatch])

    return {checkAuth, loading, isAuth}
}

export const useLogout = () =>{
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const logoutHook = async() => {
        
        setLoading(true)
        try {
            const res = await fetch(`/api/auth/logout`,{
                method: "POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({})
            })
            const data = await res.json()
            if(data.error){
                throw new Error(data.error)
            }
            dispatch(logout())
            toast.success("Logged out successfully")
        } catch (error) {   
            console.log("Error in logout hook: ", error.message)
            return toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
    return {logoutHook, loading}
}