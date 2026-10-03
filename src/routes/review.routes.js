import {Router} from "express"
import { createreview, getproductreviews, updatereview, deletereview } from "../controllers/review.controller.js"
import {verifyjwt} from "../middlewares/auth.middleware.js"

const router = Router() 
 router.post("/product/:productid", verifyjwt, createreview)
 router.get("/product/:productid", getproductreviews)
 router.put("/:reviewid", verifyjwt, updatereview)
 router.delete("/:reviewid", verifyjwt, deletereview)

export default router