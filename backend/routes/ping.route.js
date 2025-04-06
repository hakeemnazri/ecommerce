import express from "express";
import { pingURL } from "../controllers/ping.controller.js";

const router = express.Router();

router.get("/website", pingURL);

export default router;