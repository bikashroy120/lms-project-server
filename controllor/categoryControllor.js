import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import CategoryModal from "../models/categoryModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";



export const addCategory = catchAsyncErrors(async(req,res,next)=>{
    try {

        const data = {
          title:req.body.title,
          image:req.body.image,
          description:req.body.description,
        }

        const category = await CategoryModal.create(data)

        res.status(201).json({
            success:true,
            category
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400))
    }
})


export const getAllCategory = catchAsyncErrors(async(req,res,next)=>{
    try {
        const category = await CategoryModal.find().sort({createdAt:-1})

        res.status(200).json({
            success:true,
            category
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const category = await CategoryModal.findById(id);
  
      if (!category) {
        return next(new ErrorHandler("category Not found", 400));
      }
  
      await CategoryModal.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: "Category delete success",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });