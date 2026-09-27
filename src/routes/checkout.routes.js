import {Router} from 'express'
import {verifyjwt} from '../middlewares/auth.middleware.js'
import { checkout } from '../controllers/checkout.controller.js'

const router=Router()

router.route('/checkout').post(verifyjwt,checkout)

export default router