import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { addCategory, deleteCategory, getAllCategory } from "../controllor/categoryControllor.js";
const router = express.Router()

router.post("/create-category",addCategory)
router.get("/all-category",getAllCategory)
router.delete("delete/:id",deleteCategory)


export default router