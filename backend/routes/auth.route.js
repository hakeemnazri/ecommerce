import express from "express"
import { getProfile, login, logout, refreshToken, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router() // create a router that can handle requests

router.post("/signup", signup) // /api/auth/signup
router.post("/login", login) // /api/auth/login
router.post("/logout", logout) // /api/auth/logout
router.post("/refreshToken", refreshToken)
router.get("/profile", protectRoute, getProfile)
 
export default router 