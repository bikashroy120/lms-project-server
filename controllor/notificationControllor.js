import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import notificationModal from "../models/notificationModel.js";


export const getNotification = catchAsyncErrors(async(req,res,next)=>{
    try {

        const notification = await notificationModal.find().sort({createdAt:-1})
        res.status(200).json({
            success:true,
            notification
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})


export const updateNotification = catchAsyncErrors(async(req,res,next)=>{
    try {
        const id = req.params.id;
        await notificationModal.findByIdAndUpdate(id,{status:"read"})

        const notification = await notificationModal.find().sort({createdAt:-1})
        res.status(200).json({
            success:true,
            message:"update success",
            notification
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})