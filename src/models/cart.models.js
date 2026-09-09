import mongoose,{Schema} from "mongoose"

const cartSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true // one cart per user
    },
    items:[  //array of items in the cart as items can be multiple
       {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            default:1
        }
       }
    ]
},{timestamps:true})

export const Cart=mongoose.model("Cart",cartSchema)