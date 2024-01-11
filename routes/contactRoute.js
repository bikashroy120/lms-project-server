import express from "express"
import { isAutheticated } from "../middleware/auth.js";
import { contactAdd, deleteContact, getAllContact } from "../controllor/contactControllor.js";


const router = express.Router()

router.post("/post",contactAdd)
router.get("/all-get",isAutheticated,getAllContact)
router.delete("/contact-delete/:id",isAutheticated,deleteContact)



export default router