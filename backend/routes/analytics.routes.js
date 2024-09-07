import express from 'express' ; 
import { CheckAuth } from '../middleware/CheckAuth.js';
import { checkAdmin } from '../middleware/CheckAdmin.js';

const router = express.Router() ; 

router.get('/',CheckAuth,checkAdmin, async (req,res) => {
    try {
        const analyticsData = await getAnalyticsData() ;
    }catch(err) {
        console.log(err.message) ; 
        res.status(500).json({message : 'Failed to get orders'}) ;
    }
})


export default router ; 