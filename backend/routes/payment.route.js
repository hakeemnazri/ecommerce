import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { createCheckoutSession, successCheckout } from "../controllers/payment.controller.js"

const router= express.Router()

router.post("/create-route-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, successCheckout)

export default router