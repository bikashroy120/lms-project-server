import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { getCourseAnalytics, getUserAnalytics } from "../controllor/analyticsControllor.js";

const router = express.Router()

router.get("/user-analutics",isAutheticated,isAdmin,getUserAnalytics)
router.get("/course-analutics",isAutheticated,isAdmin,getCourseAnalytics)


export default router;