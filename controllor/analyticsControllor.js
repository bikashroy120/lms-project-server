import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModal from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import { generateLast12MonthData, generateLast7DaysData } from "../utils/analyticsGenerator.js";
import courseModal from "../models/courseModel.js";
import orderModale from "../models/orderModel.js";

// get user Analyser --- for admin
export const getUserAnalytics = catchAsyncErrors(async(req,res,next)=>{
    try {
        const users = await generateLast7DaysData(userModal)

        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


// get user course --- for admin
export const getCourseAnalytics = catchAsyncErrors(async(req,res,next)=>{
    try {
        const course = await generateLast12MonthData(courseModal)

        res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})

// get order analytcs  --- for admin
export const getOrderAnalytics = catchAsyncErrors(async(req,res,next)=>{
    try {
        const course = await generateLast12MonthData(orderModale)

        res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})