import {Router} from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import {searchproduct} from '../controllers/productsearch.controller.js'

const router=Router()  

router.get("/searchproducts",verifyjwt,searchproduct)  // search products by name, category, price range and sort by price or rating or newest or oldest

export default router