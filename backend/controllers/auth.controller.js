import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { redis } from "../utils/redis.js"

dotenv.config()

const generateTokens = async(userId)=>{
    const accessToken = jwt.sign({userId}, process.env.JWT_ACCESS_SECRET, {
        expiresIn:"15m"
    })
    const refreshToken = jwt.sign({userId}, process.env.JWT_REFRESH_SECRET, {
        expiresIn:"7d"
    })

    return {accessToken, refreshToken}
}

const storeRefreshToken = async(userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken,"EX", 7 * 24 * 60 * 60)
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

// controllers that handle the auth routes which are /signup, /login, /logout
export const signup = async(req, res)=>{

    try {
        const {email, password, name} = req.body

        const useExists = await User.findOne({email}) 

        if(useExists){
            return res.status(400).json({
                error:"User already exists"
            })
        }
    
        const user = await User.create({name,email,password})

        const {accessToken, refreshToken} = await generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)
    
        res.status(201).json({
            message:"User created successfully", 
            user:{
                name:user.name,
                email:user.email,
                _id:user._id,
                role:user.role,
            },
        })
    } catch (error) {
        console.log(`Error at Signup controller: `, error.message)
        res.status(500).json({
            error:`Error creating user at signup controller: ${error.message}`
        })
    }
}

export const login = async(req, res)=>{
    
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user){
           return res.status(400).json({
                error: "Invalid credentials"
            })
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')

        if(!isPasswordCorrect){
            return res.status(400).json({
                error: `Invalid credentials`
            })
        }

        const {accessToken, refreshToken} = await generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken)

        setCookies(res, accessToken, refreshToken)

        res.status(200).json({
            message:"User logged in successfully", 
            user:{
                name:user.name,
                email:user.email,
                _id:user._id,
                role:user.role,
            },
        })
        
    } catch (error) {
        console.log(`Error at Login controller: `, error.message)
        res.status(500).json({
            error:`Error logging in user at login controller: ${error.message}`})
    }
}

export const logout = async(req, res)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            await redis.del(`refreshToken:${decoded.userId}`)
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.status(200).json({
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log(`Error at Logout controller: `, error.message)
        res.status(500).json({
            error:`Error logging out user at logout controller: ${error.message}`
        })
    }
}

export const refreshToken = async(req, res)=>{
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({
                message:"Missing Refresh Token"
            })
        }
        
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized Token"
            })
        }
    
        const stroredToken = await redis.get(`refreshToken:${decoded.userId}`)
    
        if(refreshToken !== stroredToken){
            return res.status(401).json({
                message:"Unauthorized refresh Token"
            })
        }
    
        const accessToken = jwt.sign({userId:decoded.userId}, process.env.JWT_ACCESS_SECRET, {
            expiresIn:"15m"
        })
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.status(200).json({
            message:"Refresh token successful"
        })
    } catch (error) {
        console.log(`Error at Refresh Token controller: `, error.message)
        res.status(500).json({
            error:`Error refreshing token at refresh token controller: ${error.message}`
        })
    }
}


export const getProfile = async(req, res) =>{
    try {
        const user = req.user
        if(!user){
            return res.json()
        }
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in getProfile controller: ", error.message)
        return res.status(500).json({error:`Error in getProfile controller: ${error.message}`})
    }
}