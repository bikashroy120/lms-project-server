import express from "express"
import { regesterControllor, verfyUser } from "../controllor/userControllor.js"
const router = express.Router()
 
router.post("/regester",regesterControllor)
router.post("/verfy-user",verfyUser)


export default router


