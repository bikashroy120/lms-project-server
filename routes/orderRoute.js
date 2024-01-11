import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { createOrder, getAllOrder } from "../controllor/orderControllor.js";

const router = express.Router()

router.post("/create",isAutheticated,createOrder)
router.get("/all-order",isAutheticated,getAllOrder)



export default router