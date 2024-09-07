import Coupon from "../models/coupon.model.js";
export const getCoupon = async (req,res) => {
    try {
        const coupon = await Coupon.findOne({userId : req.userId , isActive : true}) ; 
        if(!coupon) {
            return res.status(404).json({message : 'Coupon not found'}) ;
        }
        res.json(coupon) ;
    }catch(err)  {
        console.log("erreur in getCoupon controller") ;
        res.status(400).json({message : err.message}) ;
    }
}


export const validateCoupon = async (req,res) => {
    try {
        const { couponCode } = req.body ;
        const coupon = await Coupon.findOne({code : couponCode, userId : req.userId ,isActive : true}) ;
        if(!coupon) {
            return res.status(404).json({message : 'Coupon not found or expired'}) ;
        }

        if(coupon.expirationDate < Date.now()) {
            coupon.isActive = false ;
            await coupon.save() ;
            return res.status(404).json({message : 'Coupon expired'}) ;  
        }
        res.json({
            message : 'Coupon valid' ,
            discount : coupon.discountPercentage  ,
            code : coupon.code
        });

    }catch(err) {
        console.log("erreur in validateCoupon controller") ;
        res.status(400).json({message : err.message}) ;
    }
}