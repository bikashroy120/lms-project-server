import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { createCourse } from "../services/couresServices.js";
import courseModal from "../models/courseModel.js";


// create new course
export const uploadCoures = catchAsyncErrors(async (req, res, next) => {
    try {
        /* ==== get data  ===== */
        const data = req.body;
        // const thumbnail = data.thumbnail;
        // /* ==== upload thumbnail  ===== */
        // if (thumbnail) {
        //     const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        //         folder: "coures"
        //     })

        //     data.thumbnail = {
        //         public_id: myCloud.public_id,
        //         url: myCloud.secure_url,
        //     }
        // }
        // create corese
        createCourse(data, res, next)
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})

// update course
export const editcourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const data = req.body;
        const thumbnail = data.thumbnail;
        const course = await courseModal.findById(courseId)
        if (!course) {
            next(new ErrorHandler("course not found", 400))
        }
        if (course && thumbnail) {
            /* ====if user have one avater then call this if  ===== */
            if (course?.thumbnail?.public_id) {
                /* ==== first delete public id and update avater  ===== */
                await cloudinary.v2.uploader.destroy(course?.thumbnail?.public_id)

                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "coures"
                })

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            } else {
                /* ==== user not avater then call this  ===== */
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "coures"
                })

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }
        }

        const updateCourse = await courseModal.findByIdAndUpdate(courseId, { $set: data }, { new: true })

        res.status(200).json({
            sucess: true,
            course: updateCourse
        })

    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


// get all course
export const getAllCourse = catchAsyncErrors(async (req, res, next) => {
    try {

        let queryStr = JSON.stringify(req.query)
        queryStr = queryStr.replace(/\b|gte|lte|lt\b/g, (match)=> `${match}`);
        const queryObj = JSON.parse(queryStr)
        console.log(queryObj)

        let query = courseModal.find(queryObj).select("-courseData")

        const course = await query;

        res.status(200).json({
            success: true,
            item:course.length,
            course
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


// get one course
export const getOneCouse = catchAsyncErrors(async (req, res, next) => {
    try {
        const courseId = req.params.id;

        const course = await courseModal.findById(courseId).select("-courseData")
        if (!course) {
            next(new ErrorHandler("course not found", 400))
        }

        res.status(200).json({
            success: true,
            course
        })

    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


// create question

export const createQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { question, couresId, contentId } = req.body;
        /* ==== find coures by coures id ===== */
        const coures = await courseModal.findById(couresId)
        if (!coures) {
            next(new ErrorHandler("Invalid course id", 400))
        }

        const courseContent = coures.courseData.find(item => item._id.equals(contentId))
        if (!courseContent) {
            next(new ErrorHandler("Invalid contentId id", 400))
        }


        // create a new question content
        const newQuestion = {
            user: req.user,
            question,
            questionReples: []
        }
        // add question to our course
        courseContent.question.push(newQuestion)

        await coures?.save()

        res.status(200).json({
            success: true,
            message: "question add successfully"
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})

// answer question
export const answerQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { answer, questionId, couresId, contentId } = req.body;
        /* ==== find coures by coures id ===== */
        const coures = await courseModal.findById(couresId)
        if (!coures) {
            next(new ErrorHandler("Invalid course id", 400))
        }
        /* ==== find course data ===== */
        const courseContent = coures.courseData.find(item => item._id.equals(contentId))
        if (!courseContent) {
            next(new ErrorHandler("Invalid contentId id", 400))
        }
        /* ==== find question ===== */
        const question = courseContent.question.find(item => item._id.equals(questionId))
        if (!question) {
            next(new ErrorHandler("Invalid question id", 400))
        }

        // create answer data

        const answerData = {
            user: req.user,
            answer
        }
        // save answer
        question.questionReples.push(answerData)
        await coures?.save()


        res.status(200).json({
            sucess: true,
            message: "answer send successfully"
        })

    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


// add review

export const addReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const couresId = req.params.id;
        const { review, rating } = req.body;
        /* ==== find coures by coures id ===== */
        const coures = await courseModal.findById(couresId)
        if (!coures) {
            next(new ErrorHandler("Invalid course id", 400))
        }

        const reviewData = {
            user: req.user,
            rating,
            comment: review,
        }

        coures.reviews.push(reviewData)

        let avg = 0;
        coures.reviews.forEach(rev => avg += rev.rating)

        if (coures) {
            coures.rating = avg / coures.reviews.length
        }

        await coures?.save()

        const notification = {
            title: "new revisition add"
        }

        res.status(200).json({
            success: true,
            coures
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})

export const replyReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { couresId, reviewReplay, reviewId } = req.body;
        /* ==== find coures by coures id ===== */
        const coures = await courseModal.findById(couresId)
        if (!coures) {
            next(new ErrorHandler("Invalid course id", 400))
        }

        const review = coures.reviews.find(item=>item._id.toString()===reviewId)
        if (!review) {
            next(new ErrorHandler("Invalid review id", 400))
        }

        const replayData = {
            user:req.user,
            reviewReplay
        }

        review.reviewReplay.push(replayData)
        await coures?.save()

        res.status(200).json({
            success:true,
            coures
        })

    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


export const getAllAdmin = catchAsyncErrors(async(req,res,next)=>{
    try {
        const course = courseModal.find().sort({createdAt:-1})

        res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})


