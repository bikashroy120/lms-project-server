import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModal from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import courseModal from "../models/courseModel.js";
import orderModale from "../models/orderModel.js";
import notificationModal from "../models/notificationModel.js";

export const createOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get data from req body ===== */
        const { courseId, payment_info } = req.body;
        const userId = req.user._id
        const user = await userModal.findById(userId)
        /* ==== find course in user ===== */
        const courseExitesINUser = user?.courses.some(course => course._id.toString() === courseId)
        if (courseExitesINUser) {
           return next(new ErrorHandler("You have already purchasd this course", 400))
        }
        /* ==== find course in course id ===== */
        const course = await courseModal.findById(courseId)
        if (courseExitesINUser) {
            return next(new ErrorHandler("course not found", 400))
        }

        const orderData={
            courseId:course?._id,
            userId:user?._id,
            payment_info,
        }

        /* ==== update user course ===== */
        user?.courses.push(course?._id)
        await user.save()


        /* ==== create a notification ===== */
        await notificationModal.create({
            user:user?._id,
            title:"New Order",
            message:`You have a new order form ${course?.name}`
        })


        course.purchased ? course.purchased = course.purchased + 1 : course.purchased;
        await course.save()

        /* ==== create a order ===== */
        const order = await orderModale.create(orderData);
        res.status(201).json({
            success:true,
            message:"order create success",
            order
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})