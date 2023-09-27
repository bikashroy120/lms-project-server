import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import notificationModal from "../models/notificationModel.js";
import cron from "node-cron"


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

cron.schedule("0 0 0 * * *",async()=>{
    const thirtyDaysAgo = new Date(Date.now()-30*24*60*60*1000);
    await notificationModal.deleteMany({status:"read",createdAt:{$lt:thirtyDaysAgo}})
    console.log("hello")
})
