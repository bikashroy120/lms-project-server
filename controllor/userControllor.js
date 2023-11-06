
import emailWithNodemailler from "../helper/email.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import userModal from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken"
import { accesstokenOption, refreshtokenOption, sendToken } from "../utils/jwt.js";
import cloudinary from "cloudinary"



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

        // try {
        //     await emailWithNodemailler(emailData)
        // } catch (error) {
        //     return next(new ErrorHandler(error.message, 400))
        // }

        res.status(201).json({
            success: true,
            message: `Pleace chack your email ${email}`,
            token: activitionToken.token,
            code:activitionCode,
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

export const creactActivitonToken = (user) => {

    console.log(user)

    const activitonnCode = Math.floor(1000 + Math.random() * 9000).toString()
    const token = jwt.sign({ user, activitonnCode }, process.env.ACTIVITION_SECRIET, { expiresIn: "5m" })

    return { token, activitonnCode }
}


export const verfyUser = catchAsyncErrors(async (req, res, next) => {

    try {
        const { token, activitonnCode } = req.body;

        console.log(token)

        const newUser = jwt.verify(token, process.env.ACTIVITION_SECRIET)

        console.log(newUser)

        if (newUser.activitonnCode !== activitonnCode) {
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



export const userLogin = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please Enter Email Or Password", 400))
        }

        const user = await userModal.findOne({ email }).select("+password")

        console.log(user)

        if (!user) {
            return next(new ErrorHandler("Invlied email and password", 400))
        }

        if (user.password !== password) {
            return next(new ErrorHandler("Invlied email and password", 400))
        }


        sendToken(user, 200, res)

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    try {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).json({
            success: true,
            message: "log out successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const updateToken = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get refresh token and send error ===== */
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new ErrorHandler("Please login to access the resourse", 400))
        }

        /* ==== verify refresh token ===== */
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
        if (!decode) {
            return next(new ErrorHandler("access token is not valid", 400))
        }
        /* ==== find user by  token ===== */
        const user = userModal.findById(decode.id)
        if (!user) {
            return next(new ErrorHandler("user not found", 400))
        }
        /* ==== genareat new  token ===== */

        const newAccesstoken = jwt.sign({id:user._id},process.env.ACCRSS_TOKEN ,{expiresIn:"5m"} )
        const newRefreshtoken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN ,{expiresIn:"3d"} )

        /* ==== send token cookies ===== */
        res.cookie('accessToken', newAccesstoken, accesstokenOption);
        res.cookie('refreshToken', newRefreshtoken, refreshtokenOption);

        /* ==== send status  ===== */
        res.status(200).json({
            success: true,
            message: "updte token",
            accesstoken: newAccesstoken
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const getOneUser = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get user id  ===== */
        const userId = req.user._id

        /* ==== find user  ===== */
        const user = await userModal.findById(userId)
        if (!user) {
            return next(new ErrorHandler("user not found", 400))
        }

        /* ==== send user  ===== */
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get old and new password  ===== */
        const { oldPassword, newPassword } = req.body;
        const userId = req.user._id;

        /* ==== find user by user id  ===== */
        const user = await userModal.findById(userId)
        if (!user) {
            return next(new ErrorHandler("user not found", 400))
        }

        /* ==== password macth  ===== */
        const isMacthPassword = user.password === oldPassword;
        if (!isMacthPassword) {
            return next(new ErrorHandler("Envalid old password", 400))
        }

        /* ==== save new password  ===== */
        user.password = newPassword;
        await user.save()

        /* ==== send status  ===== */
        res.status(200).json({
            success: true,
            message: "user password update"
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const updateAvater = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get user id ===== */
        const userId = req.user._id;
        const { avater } = req.body;
        /* ==== find user by user id  ===== */
        const user = await userModal.findById(userId)
        if (!user) {
            return next(new ErrorHandler("user not found", 400))
        }

        if (user && avater) {
            /* ====if user have one avater then call this if  ===== */ 
            if (user?.avater?.public_id) {
                /* ==== first delete public id and update avater  ===== */ 
                await cloudinary.v2.uploader.destroy(user?.avater?.public_id)

                const myCloud = await cloudinary.v2.uploader.upload(avater, {
                    folder: "avaters",
                    width: 150
                })
                user.avater = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            } else {
                /* ==== user not avater then call this  ===== */ 
                const myCloud = await cloudinary.v2.uploader.upload(avater, {
                    folder: "avaters",
                    width: 150
                })
                user.avater = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            }
        }
        /* ==== update and send  ===== */ 
        await user?.save()

        res.status(200).json({
            success:true,
            message:"user profile update success",
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// get all user for admin
export const getAllUser = catchAsyncErrors(async(req,res,next)=>{
    try {
        const users = await userModal.find().sort({createdAt:-1})
        res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// update user roll 
export const updateuserRoll = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {id,role} = req.body;
        const user = await userModal.findByIdAndUpdate(id,{role},{new:true})

        res.status(200).json({
            success:true,
            user
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})


export const deleteUser = catchAsyncErrors(async(req,res,next)=>{
    try {
        const {id} = req.params;

        const user = await userModal.findById(id)   

        if(!user){
            return next(new ErrorHandler('user Not found', 400))
        }

        await userModal.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"user delete success"
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})