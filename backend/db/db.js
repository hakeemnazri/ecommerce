import mongoose from "mongoose";

export const db = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoDb connected")
    } catch (error) {
        console.log("Error connecting to mongoDB", error.message)
    }
}