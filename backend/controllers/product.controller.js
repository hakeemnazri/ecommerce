import Product from "../models/product.model.js"
import { redis } from "../utils/redis.js"
import cloudinary from "../utils/cloudinary.js"

async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set("featuredProducts", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache: ", error.message)
    }
}

export const getAllProducts = async(req,res) =>{
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.log("Error in getAllProducts controller: ", error.message)
        res.status(500).json({
            error: `Error in getAllProducts controller: ${error.message}`})
    }
}

export const getFeaturedProducts = async(req, res)=>{
    try {
        let featuredProducts = await redis.get("featuredProducts")
            if(featuredProducts){
                return res.status(JSON.parse(featuredProducts))
            }
        featuredProducts = await Product.find({isFeatured: true}).lean()
            if(!featuredProducts){
                return res.json(404).json({message:"No featured products found"})
            }
        
        await redis.set("featuredProducts", JSON.stringify(featuredProducts))

        res.json(featuredProducts)
        
    } catch (error) {
        console.log("Error in featured products contoller: ", error.message)
        res.status(500).json({ error: `Error in featured products contoller: ${error.message}`})
    }
}

export const createProduct = async(req,res)=>{
    try {
        const {name, description, price, image, category} = req.body

        let cloudinaryResponse = null

        if(image){
           cloudinaryResponse = await cloudinary.uploader.upload(image,{
            folder:"products"
           })
        }
        const product = await Product.create({
            name,
            description, 
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse?.secure_url : "",
            category,
        })

        return res.status(201).json(product) 
    } catch (error) {
        console.log("Error in createProduct controller: ", error.message)
        return res.json(501).json({error:`Error in createProduct controller ${error.message}`})
    }
}

export const deleteProduct = async(req, res)=>{
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"Product not found"})
        }

        if(product.image){
            const imageId = product.image.split("/").pop().split(".")[0]
            await cloudinary.uploader.destroy(`products/${imageId}`)
            console.log("Image deleted")
        }

        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({message:"Product deleted successfully"})
    } catch (error) {
        console.log("Error in deleteProduct controller: ", error.message)
        return res.status(500).json({error:`Error in deleteProduct controller ${error.message}`})
    }
}

export const recommendedProducts = async(req, res) =>{
    try {
        const products = await Product.aggregate([
            {$sample:{size:3}},
            {$project:{_id:1, name:1, description:1, image:1, price:1}}
        ])

        res.json(products)
    } catch (error) {
        console.log("Error in recommendedProducts controller: ", error.message)
        res.status(500).json({error:`Error in recommendedProducts controller ${error.message}`})
    }
}

export const getProductsByCategory = async(req, res) =>{
    try {
        const {category} = req.params
        const products = await Product.find({category})
        res.json(products)
    } catch (error) {
        console.log("Error in getProductsByCategory controller: ", error.message)
        res.status(500).json({error:`Error in getProductsByCategory controller ${error.message}`})
    }
}

export const toggleFeaturedProduct = async(req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        product.isFeatured = !product.isFeatured
        const updatedProduct = await product.save()
        await updateFeaturedProductsCache()
        console.log(updatedProduct)
        res.json(updatedProduct)

    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller: ", error.message)
        res.status(500).json({error:`Error in toggleFeaturedProduct controller: ${error.message}`})
    }
} 
