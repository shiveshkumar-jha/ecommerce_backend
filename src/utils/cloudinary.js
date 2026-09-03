import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_NAME,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadoncloudinary=async(localfilepath)=>{
    try{
      if(!localfilepath){
        console.log("localfile path kaha hai bhai")
        return null
      }
      const response = await cloudinary.uploader.upload(localfilepath,
        {
            resource_type:"auto"
        }
      )
      if(fs.existsSync(localfilepath)) fs.unlink(localfilepath)
        return response.secure_url
    }
    catch(err){
       console.log(err)
       if(localfilepath && fs.existsSync(localfilepath)) fs.unlink(localfilepath)
        return null
    }
}