import express from 'express' ; 
import { stripe } from '../lib/utils/stripe.js';
import { CheckAuth } from '../middleware/CheckAuth.js';
import Coupon from '../models/coupon.model.js';
import Order from '../models/order.model.js';


export const CheckOutSession = async (req,res) => {
    try {
        const { products , couponCode} = req.body ; 
        if(!products || !couponCode) {
            return res.status(400).json({message : 'Please provide products and coupon code'}) ;
        }
        if(!Array.isArray(products) || products.length ===  0) {
            return res.status(400).json({message : 'Products array is required and should not be empty'}) ;
        }

        let totalPrice = 0 ; 

        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100) ; 
        
            totalPrice += amount * product.quantity ;
                return {
                    price_data : {
                        currency : 'USD',
                        product_data : {
                            name : product.name,
                            images : [product.image],
                        },
                    unit_amount : amount
                }
            }
        });
        let coupon = null  ;
        if(couponCode) {
            coupon = await Coupon.findOne({code : couponCode , userId : req.userId , isActive : true })  ; 
             if(coupon) {
                totalPrice = Math.round(totalPrice * coupon.discountPercentage / 100) ; 

             }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ['paypal','card'] ,
            line_items : lineItems,
            success_url : `${process.env.URL}/purchase-success?session_id={CHECKOUT_SESSION_ID} `,
            cancel_url : `${process.env.URL}/purchase-cancel`,
            client_reference_id : req.userId,
            discounts : coupon ? [
                {
                    coupon : await createStripeCoupon(coupon.discountPercentage) 
                }
            ] : [],
            metadata : {
                userId : req.userId.toString(),
                couponCode : couponCode || '' ,
                products : JSON.stringify(
                    products.map(product => ({
                        id : product._id,
                        name : product.name,
                        quantity : product.quantity,
                        price : product.price
                    }))
                )
            }
            
        });
        if(totalPrice >= 200000) {
            await createNewCoupon(req.userId) ; 
        } 

        res.json({id : session.id , totalAmount : totalPrice / 100}) ;



    }catch(err) {
        console.log('error in CheckOutSession controller') ; 
        res.status(500).json({message : err.message}) ;
    }

}


async function createStripeCoupon(discountPercentage) {
    const stripeCoupon = await stripe.coupons.create({
        duration : 'once',
        percent_off : discountPercentage,
    });
    return stripeCoupon.id ; 
}

async function createNewCoupon(userId) {
    const coupon = await Coupon.create({
        userId,
        code : "GIFT"+Math.random().toString(36).substring(2,8).toUpperCase() ,
        discountPercentage : 10 ,
        isActive : true,
        expirationDate : new Date(Date.now() + 60*60*24*30*1000) // 7 days
    });
    await coupon.save();
    return coupon ;
}





export const checkoutSuccess =  async (req,res) => {
    try {
        const { sessionId } = req.body ;
        const session = await stripe.checkout.sessions.retrieve(sessionId) ; 
        if(session.payment_status === 'paid') {
            if(session.metadata.couponCode) {
                const coupon = await Coupon.findOneAndUpdate({code : session.metadata.couponCode , userId : session.metadata.userId}, {
                    isActive : false
                });

            }
        }

        const products = JSON.parse(session.metadata.products) ;
        const newOrder = await Order.create({
            userId : session.metadata.userId,
            products : products.map(product => ({
                product : product.id,
                quantity : product.quantity,
                price : product.price
            })),
            totalAmount : session.amount_total / 100, //converst from mellimes to dinars xd
            status : 'pending' , 
            stripeSessionId : sessionId  //store session id for future reference
        });
        res.json({message : 'Order Created and coupon is not active anymore', newOrder}) ;
    }catch(err) {
        console.error(err) ;
        res.status(500).json({message : 'Error in checkout success'}) ;
    }
}