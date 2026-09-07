import {Router} from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import {verifyadmin} from '../middlewares/admin.middleware.js'
import {createcategory,getallcategories,getcategorybyid,deletecategory} from '../controllers/category.controller.js'

const router=Router()

router.post("/createcategory",verifyjwt,verifyadmin,createcategory)
router.get("/getallcategory",verifyjwt,verifyadmin,getallcategories)
router.get("/:id",verifyjwt,verifyadmin,getcategorybyid)
router.delete("/:id",verifyjwt,verifyadmin,deletecategory)

export default router 