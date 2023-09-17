import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandlers.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import dotenv from "dotenv";
dotenv.config()
// import { redis } from "../utils/redis.js";
import userModal from "../models/userModel.js";


export const isAutheticated = catchAsyncErrors(async (req, res, next) => {
    try {

        // ====get access token=====
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            return next(new ErrorHandler("Please login to access the resourse", 400))
        }
        /* ====verify token===== */
        const decodet = jwt.verify(accessToken, process.env.ACCRSS_TOKEN)
        if (!decodet) {
            return next(new ErrorHandler("access token is not valid", 400))
        }
        /* ====get user by token===== */
        const user  = await userModal.findById(decodet.id)
        if (!user) {
            return next(new ErrorHandler("user not found", 400))
        }
        /* ===== send user ===== */
        req.user = user
        next()
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})