import express from "express"
import dotenv from "dotenv"
import path from "path"
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import pingRoutes from "./routes/ping.route.js"
import cookieParser from "cookie-parser";
import { db } from "./db/db.js";
import { setupSelfPing } from "./controllers/ping.controller.js";


dotenv.config()

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: "10mb" })) // parse the body of the request
app.use(cookieParser()) // parse the cookies from the request

app.use("/api/auth", authRoutes) // auth routes
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/ping', pingRoutes)

if(process.env.NODE_ENV !== "development") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}

app.listen(PORT, ()=>{
    console.log(`Server running in ${process.env.NODE_ENV}mode on port ${PORT}`)
    db()
    setupSelfPing()
})