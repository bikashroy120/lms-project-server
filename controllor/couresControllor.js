import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandlers.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { createCourse } from "../services/couresServices.js";
import courseModal from "../models/courseModel.js";
import notificationModal from "../models/notificationModel.js";

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
    createCourse(data, res, next);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// update course
export const editcourse = catchAsyncErrors(async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const data = req.body;
    const course = await courseModal.findById(courseId);
    if (!course) {
      next(new ErrorHandler("course not found", 400));
    }
    const updateCourse = await courseModal.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );

    res.status(200).json({
      sucess: true,
      course: updateCourse,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// get all course
export const getAllCourse = catchAsyncErrors(async (req, res, next) => {
  try {
    let filters = { ...req.query };
    const excludesFields = [
      "limit",
      "page",
      "sort",
      "fields",
      "search",
      "searchKey",
      "modelName",
    ];

    excludesFields.forEach((field) => {
      delete filters[field];
    });

    let queryStr = JSON.stringify(filters);
    queryStr = queryStr.replace(/\b|gte|lte|lt\b/g, (match) => `${match}`);
    filters = JSON.parse(queryStr);

    if (req.query.search) {
      const search = req.query.search || "";
      // const regSearch = new RegExp('.*' + search + '.*','i')
      filters = {
        $or: [
          { name: { $regex: new RegExp(search, "i") } },
          { category: { $regex: new RegExp(search, "i") } },
          { level: { $regex: new RegExp(search, "i") } },
        ],
      };
    }
    // common-----------------------------------
    let queries = {};
    // ------------pagination------------------
    if (req.query.limit | req.query.page) {
      const { page = 1, limit = 2 } = req.query;
      const skip = (page - 1) * +limit;
      queries.skip = skip;
      queries.limit = +limit;
    }

    // single with multi sorting
    if (req.query.sort) {
      let sortCateory = req.query.sort;
      sortCateory = sortCateory.split(",").join(" ");
      queries.sort = sortCateory;
    }

    const course = await courseModal
      .find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .select(queries.fields)
      .sort(queries.sort);

    res.status(200).json({
      success: true,
      item: course.length,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// get one course
export const getOneCouse = catchAsyncErrors(async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await courseModal
      .findById(courseId)
      .populate("reviews.user")
      .populate("reviews.reviewReplay.user")
      .populate("courseData.question.user")
      .populate("courseData.question.questionReplay.user");
    if (!course) {
      next(new ErrorHandler("course not found", 400));
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// create question

export const createQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    const { question, couresId, contentId } = req.body;
    /* ==== find coures by coures id ===== */
    const coures = await courseModal.findById(couresId);
    if (!coures) {
      next(new ErrorHandler("Invalid course id", 400));
    }

    const courseContent = coures.courseData.find((item) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      next(new ErrorHandler("Invalid contentId id", 400));
    }

    // create a new question content
    const newQuestion = {
      user: req?.user?._id,
      question,
      questionReplay: [],
    };
    // add question to our course
    courseContent.question.push(newQuestion);

    await coures?.save();

    /* ==== create a notification ===== */
    await notificationModal.create({
      user: req.user._id,
      title: "New Question",
      message: `You have a new create Question form ${req.user.name}`,
      path: `/access-course/${couresId}`,
    });

    res.status(200).json({
      success: true,
      message: "question add successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// answer question
export const answerQuestion = catchAsyncErrors(async (req, res, next) => {
  try {
    const { answer, questionId, couresId, contentId } = req.body;
    /* ==== find coures by coures id ===== */
    const coures = await courseModal.findById(couresId);
    if (!coures) {
      next(new ErrorHandler("Invalid course id", 400));
    }
    /* ==== find course data ===== */
    const courseContent = coures.courseData.find((item) =>
      item._id.equals(contentId)
    );
    if (!courseContent) {
      next(new ErrorHandler("Invalid contentId id", 400));
    }
    /* ==== find question ===== */
    const question = courseContent.question.find((item) =>
      item._id.equals(questionId)
    );
    if (!question) {
      next(new ErrorHandler("Invalid question id", 400));
    }

    // create answer data

    const answerData = {
      user: req.user?._id,
      answer,
    };
    // save answer
    question.questionReplay.push(answerData);
    await coures?.save();

    /* ==== create a notification ===== */
    await notificationModal.create({
      user: req.user._id,
      title: "Answer Question",
      message: `You have a new Answer Question form ${req.user.name}`,
      path: `/access-course/${couresId}`,
    });

    res.status(200).json({
      success: true,
      message: "answer send successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

// =======delete course========

export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
  try {
    const couresId = req.params.id;
    const coures = await courseModal.findById(couresId);
    if (!coures) {
      next(new ErrorHandler("Invalid course id", 400));
    }

    await courseModal.findByIdAndDelete(couresId);

    res.status(200).json({
      sucess: true,
      message: "delete course successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

// =========add review=========
export const addReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { couresId, review, rating } = req.body;
    /* ==== find coures by coures id ===== */
    const coures = await courseModal.findById(couresId);
    if (!coures) {
      next(new ErrorHandler("Invalid course id", 400));
    }

    const reviewData = {
      user: req.user._id,
      rating,
      comment: review,
    };

    coures.reviews.push(reviewData);

    let avg = 0;
    coures.reviews.forEach((rev) => (avg += rev.rating));

    if (coures) {
      coures.rating = avg / coures.reviews.length;
    }

    await coures?.save();

    /* ==== create a notification ===== */
    await notificationModal.create({
      user: req.user._id,
      title: "New Review",
      message: `You have a new review form ${req.user.name}`,
      path: `/access-course/${couresId}`,
    });

    res.status(200).json({
      success: true,
      coures,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const replyReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { couresId, reviewReplay, reviewId } = req.body;
    /* ==== find coures by coures id ===== */
    const coures = await courseModal.findById(couresId);
    if (!coures) {
      next(new ErrorHandler("Invalid course id", 400));
    }

    const review = coures.reviews.find(
      (item) => item._id.toString() === reviewId
    );
    if (!review) {
      next(new ErrorHandler("Invalid review id", 400));
    }

    const replayData = {
      user: req.user._id,
      answer: reviewReplay,
    };

    review.reviewReplay.push(replayData);
    await coures?.save();

    res.status(200).json({
      success: true,
      coures,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllAdmin = catchAsyncErrors(async (req, res, next) => {
  try {
    const course = courseModal.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
