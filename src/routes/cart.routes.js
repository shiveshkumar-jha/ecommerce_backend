import { Router } from "express"
import {verifyjwt} from "../middlewares/auth.middleware.js"
import { verifyadmin } from "../middlewares/admin.middleware.js"
import { addtocart,getusercart } from "../controllers/cart.controller.js"

const router=Router()

router.post("/addtocart",verifyjwt,addtocart)

router.get("/getuserscart",verifyjwt,getusercart)

export default router