const express = require('express')
const { upload } = require('../middleware/file-upload')
const { postProduct, getProduct, getProductDetails, updateProduct, deleteProduct } = require('../controller/productController')

const router = express.Router()

router.post('/postproduct',upload.array('image',2),postProduct)
router.get('/getproduct',getProduct)
router.get('/getproductdetails/:id',getProductDetails)
router.put('/updateproduct/:id', upload.array('image', 2), updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)

module.exports=router