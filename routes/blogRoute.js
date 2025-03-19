const express = require('express')
const { postBlog, getBlog, getBlogDetails, updateBlog, deleteBlog } = require('../controller/blogController')
const { upload } = require('../middleware/file-upload')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/postblog', authMiddleware,upload.array('image',2), postBlog)
router.get('/getblogs',getBlog)
router.get('/getblogdetails/:id',getBlogDetails)
router.put('/updateblog/:id',authMiddleware,upload.array('image',2),updateBlog)
router.delete('/deleteblog/:id',deleteBlog)

module.exports=router