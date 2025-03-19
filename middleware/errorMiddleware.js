// not found
const notfound = (req,res,next) => {
    const error = new Error(`Route not found ${req.originalUrl}`)
    next(error)
}

const errorMiddleware = (error,req,res,next) => {
    const status = error.statusCode || 500
    res.status(status).json({
        message: error.message,
        stack: error.stack
    })
}

module.exports = {notfound,errorMiddleware}