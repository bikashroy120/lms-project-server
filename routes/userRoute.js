import express from "express"
import { getAllUser, getOneUser, logoutUser, regesterControllor, updateAvater, updatePassword, updateToken, updateUser, updateuserRoll, userLogin, verfyUser } from "../controllor/userControllor.js"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
const router = express.Router()
 
router.post("/regester",regesterControllor);
router.post("/activate-user",verfyUser);
router.post("/login",userLogin);
router.get("/logout",isAutheticated,logoutUser);
router.get("/refresh-token",updateToken);
router.get("/me",isAutheticated,getOneUser);
router.get("/users",isAutheticated,isAdmin,getAllUser)
router.post("/update-password",isAutheticated,updatePassword);
router.put("/update-avater",isAutheticated,updateAvater);
router.put("/update-user",isAutheticated,updateUser);
router.put("/update-role",isAutheticated,updateuserRoll)

export default router


