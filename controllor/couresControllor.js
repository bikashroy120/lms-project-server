import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { createCourse } from "../services/couresServices.js";



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