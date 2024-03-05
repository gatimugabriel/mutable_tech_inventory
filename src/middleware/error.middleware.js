const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

const errorHandler = (error, req, res, next) => { 
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error.message

    if (error.name === 'SequelizeValidationError') { 
        message = error.errors.map((err) => err.message).join(', ')
        statusCode = 400
    }

    if (error.name === 'SequelizeUniqueConstraintError') { 
        message = error.errors.map((err) => `Duplicate field value entered for ${err.path}`).join(', ')
        statusCode = 400
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') { 
        message = `Resource not found`
        statusCode = 404
    }

    res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
}

export default {notFound, errorHandler}