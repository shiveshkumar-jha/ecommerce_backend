import Router from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import {registeruser,loginuser,logoutuser,getcurrentuser} from '../controllers/user.controller.js'

const router=Router()

router.route("/register").post(registeruser)

router.route("/login").post(loginuser)

router.route("/logout").post(verifyjwt,logoutuser)

router.route("/currentuser").get(verifyjwt,getcurrentuser)

export default router