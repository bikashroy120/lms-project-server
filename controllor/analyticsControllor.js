import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModal from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import { generateLast12MonthData } from "../utils/analyticsGenerator.js";


export const getUserAnalytics = catchAsyncErrors(async(req,res,next)=>{
    try {
        const users = await generateLast12MonthData(userModal)

        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})