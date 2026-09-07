import Router from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import {verifyadmin} from '../middlewares/admin.middleware.js'
import {createproduct,getallproducts} from '../controllers/product.controller.js'
import {getproductbyid,updateproduct,deleteproduct} from '../controllers/product.controller.js'

const router = Router()

router.post("/create",verifyjwt,verifyadmin,createproduct)

router.get("/getallproducts",verifyjwt,verifyadmin,getallproducts)

router.get("/getproductbyid/:id",verifyjwt,verifyadmin,getproductbyid)

router.patch("/updateproduct/:id",verifyjwt,verifyadmin,updateproduct)

router.delete("/deleteproduct/:id",verifyjwt,verifyadmin,deleteproduct)

export default router