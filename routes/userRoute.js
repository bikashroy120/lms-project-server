import express from "express"
import { getAllUser, getOneUser, logoutUser, regesterControllor, updateAvater, updatePassword, updateToken, updateuserRoll, userLogin, verfyUser } from "../controllor/userControllor.js"
import { isAutheticated } from "../middleware/auth.js";
const router = express.Router()
 
router.post("/regester",regesterControllor);
router.post("/verfy-user",verfyUser);
router.post("/login",userLogin);
router.get("/logout",isAutheticated,logoutUser);
router.get("/refresh-token",updateToken);
router.get("/me",isAutheticated,getOneUser);
router.get("/users",isAutheticated,getAllUser)
router.post("/update-password",isAutheticated,updatePassword);
router.put("/update-avater",isAutheticated,updateAvater);
router.put("/update-role",isAutheticated,updateuserRoll)

export default router


