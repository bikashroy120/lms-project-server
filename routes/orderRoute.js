import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { createOrder, deleteOrder, getAllOrder } from "../controllor/orderControllor.js";

const router = express.Router()

router.post("/create",isAutheticated,createOrder)
router.get("/all-order",isAutheticated,getAllOrder)
router.delete("/delete-order/:id",isAutheticated,deleteOrder)



export default router