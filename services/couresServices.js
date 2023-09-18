import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import courseModal from "../models/courseModel.js";

// create a course
export const  createCourse = catchAsyncErrors(async(data,res)=>{
    const course = await courseModal.create(data);
    res.status(200).json({
        success:true,
        course,
    })
})