import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import contactModal from "../models/contactModel.js";
import ErrorHandler from "../utils/ErrorHandlers.js";


export const contactAdd = catchAsyncErrors(async(req,res,next)=>{
    try {  
        const data = req.body;
        const contact = await contactModal.create(data);
        
        res.status(200).json({
            success:true,
            contact,
        })

    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
})

export const getAllContact = catchAsyncErrors(async(req,res,next)=>{
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
              { email: { $regex: new RegExp(search, "i") } },
              { phone: { $regex: new RegExp(search, "i") } },
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
    
        const count = await contactModal.find(filters).countDocuments()
    
        const users = await contactModal
          .find(filters)
          .skip(queries.skip)
          .limit(queries.limit)
          .sort({ createdAt: -1 });
          
        res.status(200).json({
          success: true,
          item: count,
          users,
        });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
})


export const deleteContact = catchAsyncErrors(async(req,res,next)=>{
    try {
        const { id } = req.params;

        const contact = await contactModal.findById(id);
    
        if (!contact) {
          return next(new ErrorHandler("Contact Not found", 400));
        }
    
        await contactModal.findByIdAndDelete(id);
    
        res.status(200).json({
          success: true,
          message: "contact delete success",
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
})