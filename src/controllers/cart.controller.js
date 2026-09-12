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
        const existingitems=await cart.items.find(item=>item.product.toString()===productid)
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
    return res.status(200).json(new apiresponse(200,cart,"cart fetched successfully"))
})

const updatequantityincart=asyncHandler(async(req,res)=>{
    const{productid,quantity}=req.body
    if(!quantity || quantity<1) throw new apierror(400,"quantity cant be less than 1")
    if(!productid) throw new apierror(400,"productid is required")
    const product=await Product.findById(productid)
    if(!product) throw new apierror(400,"product not found")
    if(quantity>product.stock) throw new apierror(400,"requred quantity of product isn't available")
    let cart=await Cart.findOne({user:req.user._id})
    if(!cart) throw new apierror(400,"cart not found")
    let item=cart.items.find(item=>item.product.toString()===productid)
    if(!item) throw new apierror(400,"product not exist in cart")
    item.quantity=quantity
    await cart.save({validateBeforeSave:false})
    return res.status(200).json(new apiresponse(200,cart,"qunatity updated in cart"))
})

const removefromcart = asyncHandler(async (req, res) => {

    const { productid } = req.params;

    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        throw new apierror(404, "Cart not found");
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productid
    )

    await cart.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(
            new apiresponse(
                200,
                cart,
                "Product removed from cart"
            )
        )
})

const clearcart=asyncHandler(async(req,res)=>{
    const cart=await Cart.findOne({user:req.user._id})
    if(!cart) throw new apierror(400,"cart is not found")
    cart.items=[]
    await cart.save({validateBeforeSave:false})
    return res.status(200).json(new apiresponse(200,cart,"cart cleared successfully"))
})

export {addtocart,getusercart,updatequantityincart,clearcart,removefromcart}