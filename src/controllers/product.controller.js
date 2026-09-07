import {asyncHandler} from '../utils/asyncHandler.js'
import {Product} from '../models/product.models.js'
import {apiresponse} from '../utils/Apiresponse.js'
import { apierror } from '../utils/Apierror.js'
import {Category} from '../models/category.models.js'

const createproduct=asyncHandler(async(req,res)=>{
    const{name,description,price,category,discount,finalPrice,brand,stock}=req.body
    if(!name || !description || !price || !category || !brand || !stock){
        throw new apierror(400,"All fields are required")
    }
    // find category by id to check if it exists
    const categoryexists=await Category.findById(category)
    if(!categoryexists){
        throw new apierror(404,"Category not found create a category first and then create a product")
    }
    const product=await Product.create({
        name,
        description,
        price,
        category,
        discount,
        finalPrice,
        brand,
        stock
    })
    if(!product){
        throw new apierror(500,"Product creation failed")
    }
    return res.status(201).json(new apiresponse(201,product,"Product created successfully"))
})

const getallproducts=asyncHandler(async(req,res)=>{
    const products=await Product.find()
    if(!products){
        throw new apierror(404,"No products found")
    }
    return res.status(200).json(new apiresponse(200,products,"Products fetched successfully"))
})

const getproductbyid=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!id){
        throw new apierror(400,"Product id is required")
    }
    const product=await Product.findById(id)
    if(!product){
        throw new apierror(404,"Product not found")
    }
    return res.status(200).json(new apiresponse(200,product,"Product fetched successfully"))
})

const updateproduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!id){
        throw new apierror(400,"Product id is required")
    }
    const product=await Product.findByIdAndUpdate(id,req.body,{new:true})
    if(!product){
        throw new apierror(404,"Product not found")
    }
    return res.status(200).json(new apiresponse(200,product,"Product updated successfully"))
})

const deleteproduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!id){
        throw new apierror(400,"Product id is required")
    } 
    const product=await Product.findByIdAndDelete(id)
    if(!product){
        throw new apierror(404,"Product not found")
    }
    return res.status(200).json(new apiresponse(200,product,"Product deleted successfully"))
})

export {createproduct,getallproducts,getproductbyid,updateproduct,deleteproduct}