import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { createOrder } from "../controllor/orderControllor.js";

const router = express.Router()

router.post("/create",isAutheticated,createOrder)



export default router