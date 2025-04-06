import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async( req, res, next) =>{
    try {
        const accessToken = req.cookies.accessToken
        if(!accessToken){
            return res.status(401).json({ error:"Unauthorized - No access token provided"})
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({ message:"User not found"})
        }

        req.user = user

        next()

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message)
        return res.status(500).json({ error:`Unauthorized - Invalid access token: ${error.message}`})
    }
}

export const adminRoute = ( req, res, next) =>{
    try {
        if(req.user.role === "admin"){
            next()
        }else{
            console.log("Error in adminRoute middleware: ", error.message)
            return res.status(401).json({
                message: "Unauthorized - Not an admin"
            })
        }
    } catch (error) {
        console.log("Error in adminRoute middleware: ", error.message)
        return res.status(500).json({ error:`Unauthorized - Not an admin: ${error.message}`})
    }
}