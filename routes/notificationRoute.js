import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { getNotification, updateNotification } from "../controllor/notificationControllor.js";

const router = express.Router()

router.get("/notifaction",isAutheticated,getNotification)
router.put("/notifaction/:id",isAutheticated,updateNotification)


export default router