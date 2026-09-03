import {User} from '../models/user.models.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {apiresponse} from '../utils/Apiresponse.js'
import {apierror} from '../utils/Apierror.js'
import cookie from 'cookie-parser'

const registeruser=asyncHandler(async(req,res)=>{
    const{username,email,password,fullname,phone}=req.body

    if(!(username || email || password || fullname)){
        throw new apierror(400,"All fields are required")
    }

    const existeduser=await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(existeduser){
        throw new apierror(409,"User already exists")
    }

    const user=await User.create({
        username,
        email,
        password,
        fullname,
        phone
    })
    const createduser=await User.findById(user._id).select("-password -refreshtoken")
    if(!createduser){
        throw new apierror(500,"failed to create user")
    }
    return res.status(201)
           .json(new apiresponse(201,createduser,"user created successfully"))
}) 

const loginuser=asyncHandler(async(req,res)=>{
    const {email,username,password}=req.body
    if(!(email || username)) throw new apierror(400,"email or username is required")
    if(!password) throw new apierror(400,"password is required")

    const user=await User.findOne({
        $or:[
            {email},
            {username}]
    })
    if(!user) throw new apierror(404,"user does not exist")

    const haspasswordmatched=await user.ispasswordcorrect(password)
    if(!haspasswordmatched) throw new apierror(401,"invalid user credentials")
    
    const accesstoken=user.generateAccessToken()
    const refreshtoken=user.generateRefreshToken()
    user.refreshtoken=refreshtoken  // save the encrypted refresh token in the database
    await user.save({validateBeforeSave:false})

    const options={
        httpOnly:true,
        secure:true
    }
    const loginuser=await User.findById(user._id).select("-password -refreshtoken")

    return res.status(200).
        cookie("refreshtoken",refreshtoken,options)
        .cookie("accesstoken",accesstoken,options)
        .json(new apiresponse(200,loginuser,"user logged in successfully"))
})

const logoutuser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{refreshtoken:null},{new:true})
    const options={
        httpOnly:true,
        secure:true
    }
    res.clearCookie("accesstoken",options)
    res.clearCookie("refreshtoken",options)
    return res.status(200).json(new apiresponse(200,{},"user logged out successfully"))
})

const getcurrentuser=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password -refreshtoken")
    if(!user) throw new apierror(404,"user not found")
    return res.status(200).json(new apiresponse(200,user,"current user fetched successfully"))
})

const updateaccountdetails = asyncHandler(async (req, res) => {

    const { fullname, email, phone } = req.body

    if (!fullname && !email && !phone) {
        throw new apierror(
            400,
            "At least one field is required"
        )
    }

    const updateData = {};

    if (fullname) {
        updateData.fullname = fullname;
    }

    if (email) {
        updateData.email = email.toLowerCase();
    }

    if (phone) {
        updateData.phone = phone;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData
        },
        {
            new: true,
        }
    ).select("-password -refreshtoken");

    return res.status(200).json(
        new apiresponse(
            200,
            user,
            "Account details updated successfully"
        )
    )
})

const changepassword = asyncHandler(async (req, res) => {

    const {
        oldPassword,
        newPassword
    } = req.body

    if (!oldPassword || !newPassword) {
        throw new apierror(
            400,
            "Old password and new password are required"
        )
    }

    const user = await User.findById(req.user._id);

    const isOldPasswordCorrect =
        await user.ispasswordcorrect(oldPassword);

    if (!isOldPasswordCorrect) {
        throw new apierror(
            401,
            "Old password is incorrect"
        );
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: true})

    return res.status(200).json(
        new apiresponse(
            200,
            {},
            "Password changed successfully"
        )
    )
})

export {registeruser, loginuser,logoutuser,getcurrentuser,updateaccountdetails,changepassword}