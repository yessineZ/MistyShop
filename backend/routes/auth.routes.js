import express from 'express' ; 
import { getMe, LoggedOut, signIn, signUp } from '../controllers/auth.controller.js';
import { CheckAuth } from '../middleware/CheckAuth.js';

const router = express.Router() ; 


router.post('/signUp',signUp) ;
router.post('/login',signIn) ;
router.get('/logout',LoggedOut) ;
router.get('/getMe',CheckAuth,getMe)  ; 




export default router ;