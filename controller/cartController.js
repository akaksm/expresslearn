const { cartModel } = require("../models/cartModel");
const { productModel } = require("../models/productModel");
const { ApiError } = require("../utils/apiError");
const { ApiResponse } = require("../utils/apiResponse");
const { asyncHandler } = require("../utils/asyncHandler");


const addToCart = asyncHandler(async(req,res)=>{
    const userId = req.user
    const {productId,quantity} = req.body

    if (!productId || !quantity) throw new ApiError(`Field cannot be empty.`,400)

    const product = await productModel.findById(productId)
    if (!product) throw new ApiError(`Product Id did not found`,400)


    const cart = await cartModel.create({
        userId:userId._id,
        productId:productId,
        quantity:quantity
    })


    return res.status(201).json(new ApiResponse(`Added to cart`,cart))
})

const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user

    const cart = await cartModel.findById(req.params.id)
    if (!cart) throw new ApiError(`Cart id does not match`, 400)

    if (cart.userId.toString() !== userId._id.toString()) throw new ApiError(`Something went wrong`, 400)

    await cartModel.findByIdAndDelete(req.params.id)

    return res.status(201).json(new ApiResponse(`Removed from cart`, cart))
})

const increaseCart = asyncHandler(async (req, res) => {
    const userId = req.user
    const { cartId } = req.body

    if (!cartId) throw new ApiError(`Cart ID is required.`, 400)

    const cart = await cartModel.findById(cartId)
    if (!cart) throw new ApiError(`Cart id does not match`, 400)

    if (cart.userId.toString() !== userId._id.toString()) throw new ApiError(`Something went wrong`, 400)

    cart.quantity += 1
    await cart.save()

    return res.status(200).json(new ApiResponse(`Cart quantity incremented`, cart))
})

const decreaseCart = asyncHandler(async (req, res) => {
    const userId = req.user
    const { cartId } = req.body

    if (!cartId) throw new ApiError(`Cart ID is required.`, 400)

    const cart = await cartModel.findById(cartId)
    if (!cart) throw new ApiError(`Cart id does not match`, 400)

    if (cart.userId.toString() !== userId._id.toString()) throw new ApiError(`Something went wrong`, 400)

    if (cart.quantity === 1) {
        await cartModel.findByIdAndDelete(cartId)
        return res.status(200).json(new ApiResponse(`Item removed from cart`, null))
    } else {
        cart.quantity -= 1
        await cart.save()
        return res.status(200).json(new ApiResponse(`Cart quantity decremented`, cart))
    }
})

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user

    const cartItems = await cartModel.find({ userId: userId._id }).populate('productId')
    if (!cartItems.length) throw new ApiError(`No items found in the cart`, 404)

    return res.status(200).json(new ApiResponse(`Cart items retrieved`, cartItems))
})

module.exports = {addToCart,removeFromCart,increaseCart,decreaseCart,getCart}