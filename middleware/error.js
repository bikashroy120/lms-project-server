import ErrorHandler from "../utils/ErrorHandlers.js";


export const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message ?? "Internal server error"


    // wrong mongodb url
    if (err.name === 'CastError') {
        const message = `Resource not found. INvalid: ${err.path}`
        err = new ErrorHandler(message, 400);
    }

    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    // jwt expired error
    if (err.name === "tokenExpiredError") {
        const message = `Json web token is expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}