import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { getUserAnalytics } from "../controllor/analyticsControllor.js";

const router = express.Router()

router.get("/user-analutics",isAutheticated,isAdmin,getUserAnalytics)


export default router;