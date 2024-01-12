import ErrorHandler from "../utils/ErrorHandlers.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import layoutModal from "../models/layoutModel.js";

export const createLayout = catchAsyncErrors(async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type === "Home") {
      const { title, subTitle, Trusted, review } = req.body;
      const data = {
        type: type,
        home: {
          title,
          subTitle,
          Trusted,
          review,
          image,
        },
      };
      const layout = await layoutModal.create(data);
      res.status(201).json({
        success: true,
        message: "Home data create",
        layout,
      });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

export const editLayout = catchAsyncErrors(async (req, res, next) => {
  try {
    const { type } = req.body;

    if (type === "Home") {
      const home = await layoutModal.findOne({ type: "Home" });
      if (!home) {
        next(new ErrorHandler("Home data not found", 400));
      }
      const {
        title,
        subTitle,
        Trusted,
        review,
        image,
        logo,
        Courses,
        Tutors,
        Certified,
        Students,
        phone,
        email,
        address,
        text,
        links,
      } = req.body;
      const data = {
        home: {
          title,
          subTitle,
          Trusted,
          review,
          image,
          logo,
          Courses,
          Tutors,
          Certified,
          Students,
          phone,
          email,
          address,
          text,
          links,
        },
      };
      const layout = await layoutModal.findByIdAndUpdate(
        home?._id,
        { $set: data },
        { new: true }
      );
      res.status(201).json({
        success: true,
        message: "Home data create",
        layout,
      });
    }

    next(new ErrorHandler("invalid type", 400));
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});

export const getLayout = catchAsyncErrors(async (req, res, next) => {
  try {
    const { type } = req.query;

    const layout = await layoutModal.findOne({ type: type });

    res.status(200).json({
      success: true,
      message: "find data",
      data: layout,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
});
