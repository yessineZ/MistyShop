import express from 'express' ; 
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controllers/cart.controller.js';
import { CheckAuth } from '../middleware/CheckAuth.js';

const router = express.Router() ; 


router.get('/getCart',CheckAuth,getCartProducts) ; 
router.post('/',CheckAuth,addToCart) ; 
router.delete('/',CheckAuth,removeAllFromCart) ; 
router.put('/:id',CheckAuth,updateQuantity) ; 

export default router ;
