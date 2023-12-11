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

      let filters = { ...req.query };
      const excludesFields = [
          "limit",
          "page",
          "sort",
          "fields",
          "search",
          "searchKey",
          "modelName"
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
            { title: { $regex: new RegExp(search, "i") } },
          ],
        };
      }
      // common-----------------------------------
      let queries = {};
      // ------------pagination------------------
      if (req.query.limit | req.query.page) {
        const { page = 1, limit = 2 } = req.query;
        const skip = (page - 1) * + limit;
        queries.skip = skip;
        queries.limit = +limit;
      }
  
      // single with multi sorting
      if (req.query.sort) {
        let sortCateory = req.query.sort;
        sortCateory = sortCateory.split(",").join(" ");
        queries.sort = sortCateory;
      }else{
        queries.sort = {createdAt:-1};
      }
  

      const category = await CategoryModal.find().find(filters).skip(queries.skip).limit(queries.limit).select(queries.fields).sort(queries.sort);

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


  export const getSingleCategory = catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const category = await CategoryModal.findById(id);
  
      if (!category) {
        return next(new ErrorHandler("category Not found", 400));
      }
  
      res.status(200).json({
        success: true,
        message: "Category delete success",
        category
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });

  export const editCategory = catchAsyncErrors(async(req,res,next)=>{
    try {
      const courseId = req.params.id;
      const data = req.body;
      const course = await CategoryModal.findById(courseId);
      if (!course) {
        next(new ErrorHandler("course not found", 400));
      }

      console.log(data)
      console.log(courseId)

      const updateCategory = await CategoryModal.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        category: updateCategory,
      });
      
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })