import {Category} from '../models/category.models.js'
import { asyncHandler} from "../utils/asyncHandler.js"
import { apiresponse } from '../utils/Apiresponse.js'
import { apierror } from '../utils/Apierror.js'

const createcategory=asyncHandler(async(req,res)=>{ 
    const {name,description}=req.body
    if(!name) throw new apierror(400,"category name is required")
    const categoryexists=await Category.findOne({name}) 
    if(categoryexists) throw new apierror(400,"category already exists")
    const category=await Category.create({
              name,
              description
    })
    if(!category) throw new apierror(500,"category creation failed")
    return res.status(201).json(new apiresponse(201,category,"category created successfully"))
}) 

const getallcategories=asyncHandler(async(req,res)=>{
    const categories=await Category.find({isActive:true}).sort({createdAt:-1})
    if(!categories) throw new apierror(404,"no categories found")
    return res.status(200).json(new apiresponse(200,categories,"categories fetched successfully"))
})

const getcategorybyid=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const category=await Category.findById(id)
    if(!category) throw new apierror(404,"category not found")
    return res.status(200).json(new apiresponse(200,category,"category fetched successfully"))
})

const deletecategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const category=await Category.findByIdAndUpdate(id,{isActive:false},{new:true})
    if(!category) throw new apierror(404,"category not found")
    return res.status(200).json(new apiresponse(200,category,"category deleted successfully"))
})

export {createcategory,getallcategories,getcategorybyid,deletecategory}