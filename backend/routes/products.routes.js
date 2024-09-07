import express from 'express' ; 
import { createProduct, getAllProducts ,deleteProduct, getRecommendedProduct, getProductsByCategory, toogleFeaturedProduct } from '../controllers/products.controller.js';
import { CheckAuth } from '../middleware/CheckAuth.js';
import { checkAdmin } from '../middleware/CheckAdmin.js';
const router = express.Router() ; 

router.get('/',CheckAuth,checkAdmin,getAllProducts) ; 
router.post('/',CheckAuth,checkAdmin,createProduct) ; 
router.delete('/delete/:id',CheckAuth,checkAdmin,deleteProduct) ; 
router.get('/recommendations',getRecommendedProduct) ; 
router.get('/category/:category',getProductsByCategory) ;
router.patch('/toogle/:id',CheckAuth,checkAdmin,toogleFeaturedProduct) ; 
 


export default router ; 
