const express = require('express')

const { authMiddleware } = require('../middleware/authMiddleware')
const { postComment, updateComment, getComment, getCommentDetails, deleteComment } = require('../controller/commentController')

const router = express.Router()

router.post('/addcomment', authMiddleware, postComment)
router.put('/updatecomment/:id',authMiddleware, updateComment)
router.get('/getcomment',getComment)
router.get('/getcommentdetails/:id',getCommentDetails)
router.delete('/deletecomment',deleteComment)

module.exports=router