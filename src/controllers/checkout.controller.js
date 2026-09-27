import {asyncHandler} from "../utils/asyncHandler.js"
import { apierror} from "../utils/Apierror.js"
import { apiresponse} from "../utils/Apiresponse.js"
import {Cart} from "../models/cart.models.js"
import {Address} from "../models/address.models.js"
const checkout=asyncHandler(async(require,res)=>{
    const {addressid}=req.body
    if(!addressid) throw new Apierror(400,"address is required")
    const address=await Address.findOne({_id:addressid,user_id:req.user._id})
    if(!address) throw new apierror(400,"address not found")

    const cart=await Cart.findOne({
        user:req.user._id
    }).populate({
        path:"items.product",
        select:"name price discount image finalprice stock"
    })
    if(!cart || cart.items.length===0) throw new apierror(400,"cart is empty")

    const items=[]
    let subtotal=0
    for(const item of cart.items){
        const product=item.product
        if(!product) throw new apierror(400,"one of the product is missing")
        if(item.quantity>product.stock) throw new apierror(400,`only ${product.stock} units of ${product.name} is available currently`)
        const itemtotal=product.finalprice*item.quantity
        subtotal+=itemtotal
        items.push({
            product:product._id,
            name:product.name,
            image:product.image,
            price:product.price,
            discount:product.discount,
            finalprice:product.finalprice,
            quantity:item.quantity,
            subtotal:itemtotal
        })
    }
    const shippingcharge=subtotal>=500?50:0
    const discount=0
    const tax=0
    const totalamount=subtotal+shippingcharge-discount+tax
    return res.status(200).json(new apiresponse(200,{
         address,items,pricing:{
            subtotal,
            shippingcharge,
            discount,
            tax,
            totalamount
         }
    },"checkout details fetched successfully"))
})
export  {checkout}