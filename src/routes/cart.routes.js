import { Router } from "express"
import {verifyjwt} from "../middlewares/auth.middleware.js"
import { verifyadmin } from "../middlewares/admin.middleware.js"
import { addtocart,getusercart,updatequantityincart ,removefromcart,clearcart} from "../controllers/cart.controller.js"

const router=Router()

router.post("/addtocart",verifyjwt,addtocart)

router.get("/getuserscart",verifyjwt,getusercart)

router.patch("/updateqtyincart".verifyjwt,updatequantityincart)

router.delete("removeitemfromcart",verifyjwt,removefromcart)

router.delete("/clearcart",verifyjwt,clearcart)

export default router