import Product from "../models/product.model.js"
import User from "../models/user.model.js"

export const getCartProducts = async(req, res) =>{
    try {
        const userWithCartItems = await User.findById(req.user.id).populate("cartItems.product")
        console.log(userWithCartItems)
        const products = userWithCartItems.cartItems.filter(item => item.product !== null)
        console.log(products)
        res.json(products)

    } catch (error) {
        console.log("Error in getCartProducts controller: ", error.message)
        res.status(500).json({error:`Error in getCartProducts controller ${error.message}`})
    } 
} 

export const addToCart = async(req, res) =>{
    try {
        const {productId} = req.body
        const user = req.user
        const existingItem = user.cartItems.find(item => item.product.toString() === productId)
        if(existingItem){
            existingItem.quantity++
        }else{
            user.cartItems.push({product: productId})
        }

        await user.save()
        const data = await User.findById(user.id).populate("cartItems.product")
        res.json(data.cartItems) 
    } catch (error) {
        console.log("Error in addToCart controller: ", error.message)
        res.status(500).json({error:`Error in addToCart controller: ${error.message}`})
    }
}

export const removeAllFromCart = async(req, res) =>{
    try {
        const {productId} = req.body
        const user = req.user
        if(!productId){
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId)
        }
        await user.save()
        const data = await User.findById(user.id).populate("cartItems.product")
        res.json(data.cartItems)
    } catch (error) {
        console.log("Error in removeFromCart controller: ", error.message)
        res.status(500).json({error:`Error in removeFromCart controller: ${error.message}`})
    }
}

export const updateQuantity = async(req, res) =>{
    try {
        const {id: productId} = req.params
        const {quantity} = req.body
        const user = req.user
        const existingItem = user.cartItems.find(item => item.product.toString() === productId)
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId)
                console.log(user.cartItems)
                await user.save()
                return res.json(user.cartItems)
            }else{
                existingItem.quantity = quantity
                await user.save()
                const data = await User.findById(user._id).populate("cartItems.product")
                return res.json(data.cartItems)
            }
        }else{
            return res.status(404).json({message:"Item not found in cart"})
        }
    } catch (error) {
        console.log("Error in updateQuantity controller: ", error.message)
        res.status(500).json({error:`Error in updateQuantity controller: ${error.message}`})
    }
} 
