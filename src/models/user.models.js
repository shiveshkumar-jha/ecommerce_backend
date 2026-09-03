import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        tolowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        tolowercase:true
    },
    password:{
       type:String,
       required:true,
       trim:true,
       minlength:6
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
    },
    phone:{
      type:String,
      default:null
    },
    avatar:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"   // go to mongo db atlas and change the role of the user to admin if you want to make a user an admin
    },
    isactive:{
        type:Boolean,
        default:true
    },
    refreshtoken:{
        type:String,
        default:null
    }
},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.ispasswordcorrect=async function(enteredpassword){
    return bcrypt.compare(enteredpassword,this.password)
}

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () { 

    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)