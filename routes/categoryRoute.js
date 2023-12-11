import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { addCategory, deleteCategory, editCategory, getAllCategory, getSingleCategory } from "../controllor/categoryControllor.js";
const router = express.Router()

router.post("/create-category",addCategory)
router.get("/all-category",getAllCategory)
router.get("/single-category/:id",getSingleCategory)
router.put("/edit-category/:id",editCategory)
router.delete("/delete-category/:id",deleteCategory)


export default router