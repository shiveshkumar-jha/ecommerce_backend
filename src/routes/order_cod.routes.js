import { Router } from "express"
import { verifyjwt } from "../middlewares/auth.middleware.js"
import { verifyadmin } from "../middlewares/admin.middleware.js"
import { placecodorder,getmyorders, getorderbyid , cancelorder, updateorderstatus } from "../controllers/order_cod.controller.js"

 const router=Router()

 router.route("/order_cod/order").post(verifyjwt,placecodorder)
 router.route("/order_cod/myorders").get(verifyjwt,getmyorders)
 router.route("/order_cod/order/:orderid").get(verifyjwt,getorderbyid)
 router.route("/order_cod/order/:orderid/cancel").put(verifyjwt,cancelorder)
 router.route("/order_cod/order/:orderid/status").put(verifyjwt,verifyadmin,updateorderstatus)

 export default router