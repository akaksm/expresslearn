const { error } = require('console')
const multer = require('multer')
const path = require('path')
const { ApiError } = require('../utils/apiError')

const storage = multer.diskStorage({
    //destination
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },

    // file name
    filename: function (req, file, cb) {
        cb(null, file.fieldname+ Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({ storage:storage})

const handleMulterError = (err,req,res,next) => {
    if ( err instanceof multer.MulterError) throw new ApiError(err.message,400)
    else if (err) throw new ApiError(err.message,400)
    next()
}

module.exports = {upload, handleMulterError}