import {asyncHandler} from '../utils/asyncHandler.js'
import {apierror} from '../utils/Apierror.js'
import { apiresponse} from '../utils/Apiresponse.js'
import { Cart } from '../models/cart.models.js'
import { Product } from '../models/product.models.js'

const addtocart=asyncHandler(async(req,res)=>{
    const{productid,quantity=1}=req.body
    if(!productid) throw new apierror(400,"productid is required")
    const product=await Product.findById(productid)
    if(!product) throw new apierror(400,"product not found")
    if(product.stock<quantity) throw new apierror(400,"required number of product isn't available")
    
    let cart=await Cart.findOne({user:req.user._id})
    if(!cart){ // create
       cart=await Cart.create({
         user:req.user._id,
         items:[
            {
                product:productid,
                quantity 
            }
         ]
       })
    }
    else{
        const existingitems=await cart.items.find(item=>item.product.toString()==productid)
        if(existingitems){
            const newquantity=existingitems.quantity+quantity
            if(newquantity>product.quantity) throw new apierror(400,"required number of product isn't available")
            existingitems.quantity=newquantity
        }
        else{
            await cart.items.push({
                product:productid,
                quantity
            })
        }
        await cart.save({validateBeforeSave:false})
    }
    return res.status(200).json(new apiresponse(200,cart,"items added to cat successfully"))
})

const getusercart=asyncHandler(async(req,res)=>{
    const cart=await Cart.aggregate({
       user:req.user._id
    }).populate({  // aggreagetion pipeline can be used instead of populate but populate is much easier to implement
        path:"items.product",
        select:"name,price,discount,finalprice,image,stock"
    })
    if(!cart) return res.status(200,{},"cart is empty")
    return res.status(200,cart,"cart fetched successfully")
})

export {addtocart,getusercart}