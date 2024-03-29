import express from "express"
import { isAdmin, isAutheticated } from "../middleware/auth.js";
import { addReview, answerQuestion, createQuestion, deleteCourse, editcourse, getAllAdmin, getAllCourse, getOneCouse, replyReview, uploadCoures } from "../controllor/couresControllor.js";
const router = express.Router()

router.post("/create-course",isAutheticated,uploadCoures)
router.put("/update-course/:id",isAutheticated,editcourse)
router.get("/all-course",getAllCourse)
router.get("/:id",getOneCouse)
router.get("/course-admin",isAutheticated,isAdmin,getAllAdmin)
router.delete("/delete-course/:id",isAutheticated,deleteCourse)
router.put("/question-add",isAutheticated,createQuestion)
router.put("/question-answer",isAutheticated,answerQuestion)
router.put("/add-review",isAutheticated,addReview)
router.put("/review-replay",isAutheticated,replyReview)

export default router