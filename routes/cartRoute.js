const express = require('express')
const { addToCart, removeFromCart, increaseCart, decreaseCart, getCart } = require('../controller/cartController')
const { authMiddleware } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/addtocart',addToCart)
router.delete('/removefromcart/:id', authMiddleware, removeFromCart)
router.put('/increasecart', authMiddleware, increaseCart)
router.put('/decreasecart', authMiddleware, decreaseCart)
router.get('/getcart', authMiddleware, getCart)

module.exports=router