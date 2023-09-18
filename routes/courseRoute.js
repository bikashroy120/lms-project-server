import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { editcourse, getAllCourse, getOneCouse, uploadCoures } from "../controllor/couresControllor.js";
const router = express.Router()

router.post("/create-course",isAutheticated,uploadCoures)
router.put("/update-course/:id",isAutheticated,editcourse)
router.get("/all-course",getAllCourse)
router.get("/:id",getOneCouse)

export default router