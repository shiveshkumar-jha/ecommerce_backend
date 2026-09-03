import jwt from 'jsonwebtoken'
import {asyncHandler} from '../utils/asyncHandler.js'
import {apierror} from '../utils/Apierror.js'
import {User} from '../models/user.models.js'

const verifyjwt=async(req,res,next)=>{
    try{
        const token=req.cookies?.accesstoken
        if(!token) throw new apierror(401,"unauthorized access")
        const decorded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decorded._id).select("-password -refreshToken")
        if(!user) throw new apierror(401,"invalid access token")
        req.user=user /// now request contains user information and can be accessed in the next middleware or route handler
        next()
    } catch(err){
        throw new apierror(401,"unauthorized access")
    }
}
export {verifyjwt}
