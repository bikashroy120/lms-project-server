import express from "express"
import { logoutUser, regesterControllor, updateToken, userLogin, verfyUser } from "../controllor/userControllor.js"
import { isAutheticated } from "../middleware/auth.js";
const router = express.Router()
 
router.post("/regester",regesterControllor);
router.post("/verfy-user",verfyUser);
router.post("/login",userLogin);
router.get("/logout",isAutheticated,logoutUser);
router.get("/refresh-token",updateToken);


export default router


