
import emailWithNodemailler from "../helper/email.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModal from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken"



export const regesterControllor = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // ====chack email exits====
        const isEmailExist = await userModal.findOne({ email })
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exit", 400))
        }

        const user = {
            name,
            email,
            password,
        }

        const activitionToken = creactActivitonToken(user)
        const activitionCode = activitionToken.activitonnCode;

        const emailData = {
            email,
            subject: "Acount Activition Email",
            html: `
                <h2> hello ${user.name} !</h2>
                <h2> Code : ${activitionCode} !</h2>
            `
        }

        try {
            await emailWithNodemailler(emailData)
        } catch (error) {
            return next(new ErrorHandler(error.message, 400))
        }

        res.status(201).json({
            success: true,
            message: `Pleace chack your email ${email}`,
            token: activitionToken
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const creactActivitonToken = (user) => {
    const activitonnCode = Math.floor(1000 + Math.random() * 9000)
    const token = jwt.sign({ user, activitonnCode }, process.env.ACTIVITION_SECRIET, { expiresIn: "5m" })

    return { token, activitonnCode }
}


export const verfyUser = catchAsyncErrors(async (req, res, next) => {

    try {
        const { token, activitonnCode } = req.body;

        const newUser = jwt.sign(token, process.env.ACTIVITION_SECRIET)

        if (newUser.activitionCode !== activitonnCode) {
            return next(new ErrorHandler("Invalid OTP code", 400))
        }

        const { name, email, password } = newUser.user;

        // ====chack email exits====
        const isEmailExist = await userModal.findOne({ email })
        if (isEmailExist) {
            return next(new ErrorHandler("Email already exit", 400))
        }

        const user = await userModal.create({
            name,
            email,
            password
        })

        res.status(200).json({
            success: true
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }

})