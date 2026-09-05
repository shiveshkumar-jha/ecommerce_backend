import mongoose,{Schema} from 'mongoose'

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    discount:{
        type:Number,
        default:0
    },
    finalPrice:{
        type:Number,
        default:0
    },
    brand:{
        type:String,
        required:true 
    },
    stock:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        default:0   
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    isactive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

// Pre-save hook to calculate finalPrice
productSchema.pre('save', function () {
  if (this.isModified('price') || this.isModified('discount')) {
    // Calculates discounted price if discount exists, otherwise defaults to price
    this.finalPrice = this.price - (this.price * (this.discount / 100));
  }
});

export const Product=mongoose.model("Product",productSchema)