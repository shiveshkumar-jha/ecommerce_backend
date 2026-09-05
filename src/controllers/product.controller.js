import {asyncHandler} from '../utils/asyncHandler.js'
import {Product} from '../models/product.models.js'
import {apiresponse} from '../utils/Apiresponse.js'
import { apierror } from '../utils/Apierror.js'

const createproduct=asyncHandler(async(req,res)=>{
    const{name,description,price,category,discount,finalPrice,brand,stock}=req.body
    if(!name || !description || !price || !category || !brand || !stock){
        throw new apierror(400,"All fields are required")
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

export {createproduct,getallproducts}