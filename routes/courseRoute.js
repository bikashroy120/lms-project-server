import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { editcourse, uploadCoures } from "../controllor/couresControllor.js";
const router = express.Router()

router.post("/create-course",isAutheticated,uploadCoures)
router.put("/update-course/:id",isAutheticated,editcourse)

export default router