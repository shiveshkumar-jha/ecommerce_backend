import Router from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import {verifyadmin} from '../middlewares/admin.middleware.js'
import {registeruser,loginuser,logoutuser,getcurrentuser,updateaccountdetails,changepassword} from '../controllers/user.controller.js'
import {getallusers,getuserbyid,deleteuser,changeuserrole} from '../controllers/user.controller.js'

const router=Router()

router.route("/register").post(registeruser)

router.route("/login").post(loginuser)

router.route("/logout").post(verifyjwt,logoutuser)

router.route("/currentuser").get(verifyjwt,getcurrentuser)

router.route("/update").patch(verifyjwt,updateaccountdetails)

router.route("/changepassword").patch(verifyjwt,changepassword)

        // ADMIN ROUTES //
router.route("/getallusers").get(verifyjwt,verifyadmin,getallusers)

router.route("/getuserbyid/:id").get(verifyjwt,verifyadmin,getuserbyid)

router.route("/deleteuser/:id").delete(verifyjwt,verifyadmin,deleteuser)

router.route("/changeuserrole/:id").patch(verifyjwt,verifyadmin,changeuserrole)

export default router