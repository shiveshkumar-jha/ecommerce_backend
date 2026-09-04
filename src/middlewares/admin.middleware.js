import {asyncHandler} from '../utils/asyncHandler.js'
import {apierror} from '../utils/Apierror.js'

const verifyadmin=asyncHandler(async(req,res,next)=>{
    if(!req.user) throw new apierror(401,"user is not authenticated")
    if(req.user.role!=="admin") throw new apierror(403,"only admin can access this route")
    next()
})
export {verifyadmin}