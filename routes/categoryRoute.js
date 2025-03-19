const express = require('express')
const { postCategory, updateCategory, showCategory } = require('../controller/categoryController')

const router = express.Router()

router.post('/postcategory',postCategory)
router.put('/updatecategory/:id',updateCategory)
router.get('/getcategory',showCategory)

module.exports = router