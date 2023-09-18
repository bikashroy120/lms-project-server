import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { createCourse } from "../services/couresServices.js";
import courseModal from "../models/courseModel.js";


// create new course
export const uploadCoures = catchAsyncErrors(async(req,res,next)=>{
    try {
        /* ==== get data  ===== */
        const data = req.body;
        const thumbnail = data.thumbnail;
        /* ==== upload thumbnail  ===== */
        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"coures"
            })

            data.thumbnail = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url,
            }
        }
        // create corese
        createCourse(data,res,next)
    } catch (error) {
        next(new ErrorHandler(error.message,500))
    }
})


export const editcourse = catchAsyncErrors(async(req,res,next)=>{
    try {
        const courseId = req.params.id;
        const data = req.body;
        const thumbnail = data.thumbnail;
        const course = await courseModal.findById(courseId)
        if(!course){
            next(new ErrorHandler("course not found",400))
        }
        if (course && thumbnail) {
            /* ====if user have one avater then call this if  ===== */ 
            if (course?.thumbnail?.public_id) {
                /* ==== first delete public id and update avater  ===== */ 
                await cloudinary.v2.uploader.destroy(course?.thumbnail?.public_id)

                const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                    folder:"coures"
                })
    
                data.thumbnail = {
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url,
                }
            } else {
                /* ==== user not avater then call this  ===== */ 
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                    folder:"coures"
                })
    
                data.thumbnail = {
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url,
                }
            }
        }

        const updateCourse = await courseModal.findByIdAndUpdate(courseId,{$set:data},{new:true})
         
        res.status(200).json({
            sucess:true,
            course:updateCourse
        })

    } catch (error) {
        next(new ErrorHandler(error.message,500))
    }
})