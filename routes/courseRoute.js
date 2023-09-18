import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { uploadCoures } from "../controllor/couresControllor.js";
const router = express.Router()

router.post("/create-course",isAutheticated,uploadCoures)


export default router