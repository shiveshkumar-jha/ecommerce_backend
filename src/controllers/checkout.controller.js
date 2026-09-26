import {asyncHandler} from "../utils/asyncHandler.js"
import {apierror, Apierror} from "../utils/Apierror.js"
import {Apiresponse} from "../utils/Apiresponse.js"
import {Cart} from "..models/cart.models.js"
import {Address} from "..models/address.models.js"
const checkout=asyncHandler(async(require,res)=>{
    const {addressid}=req.body
    if(!addressid) throw new Apierror(400,"address is required")
    const address=await Address.findOne({_id:addressid,user_id:require.user._id})
    if(!address) throw new apierror(400,"address not found")

    const cart=await Cart.findOne({
        user:req.user._id
    }).populate({
        path:"items.product",
        select:"name price discount image finalprice stock"
    })
    if(!cart || cart.items.length===0) throw new apierror(400,"cart is empty")
})