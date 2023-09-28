import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllor/analyticsControllor.js";

const router = express.Router()

router.get("/user-analutics",isAutheticated,isAdmin,getUserAnalytics)
router.get("/course-analutics",isAutheticated,isAdmin,getCourseAnalytics)
router.get("/order-analutics",isAutheticated,isAdmin,getOrderAnalytics)


export default router;