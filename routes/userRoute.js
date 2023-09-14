import express from "express"
import { logoutUser, regesterControllor, userLogin, verfyUser } from "../controllor/userControllor.js"
const router = express.Router()
 
router.post("/regester",regesterControllor);
router.post("/verfy-user",verfyUser);
router.post("/login",userLogin);
router.get("/logout",logoutUser);


export default router


