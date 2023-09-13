import express from "express"
import { regesterControllor } from "../controllor/userControllor.js"
const router = express.Router()
 
router.post("/regester",regesterControllor)


export default router


