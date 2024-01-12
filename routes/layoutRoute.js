import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { createLayout, editLayout, getLayout } from "../controllor/layoutCotrollor.js";

const router = express.Router()

router.post("/create",createLayout)
router.put("/update",editLayout)
router.get("/get-data",getLayout)

export default router