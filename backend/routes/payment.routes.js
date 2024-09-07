import express from 'express';
import { CheckAuth } from '../middleware/CheckAuth.js';
import { stripe } from '../lib/utils/stripe.js';
import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';
import { checkoutSuccess } from '../controllers/payment.controller.js';
import { CheckOutSession } from '../controllers/payment.controller.js';

const router = express.Router() ; 

router.post('/create-checkout-session',CheckAuth,CheckOutSession) ; 
router.post('/checkout-success',CheckAuth,checkoutSuccess)


export default router ; 