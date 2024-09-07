import express from 'express' ; 
import { CheckAuth } from '../middleware/CheckAuth.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';

const router = express.Router() ; 

router.get('/',CheckAuth,getCoupon) ;
router.get('/validate',CheckAuth,validateCoupon) ;

export default router ; 