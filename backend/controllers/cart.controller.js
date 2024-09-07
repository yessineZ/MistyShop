import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req,res) => {
    try {
        const userId = req.userId ; 
        const user = await User.findById(userId)  ;
        if(!user) return res.status(404).json({message : 'User not found'}) ;
        const products = await Product.find({_id : { $in : user.cartItems }}) ;
        const cartItems = products.map((product) => {
            const item = user.cartItems.find(cartItem => cartItem._id === product.id ) ;
            return {
                product ,
                quantity : item.quantity, 
            }
        } );
        return res.json({cartItems}) ; 
    }catch(err) {
         console.log('error in getCartProducts controller', err.message) ;  
        res.status(404).json({message : err.message}) ; 
    }
}

export const addToCart = async () => {
    try {
        const { productId}  = req.body ;
        const userId = req.userId ;

        const user = await User.findById(userId)  ; 

        const existingItem = user.cartItems.find((item) => item.id === productId ) ; 
        
        if(existingItem) {

            existingItem.quantity++ ;
        
        }else {

            user.cartItems.push(productId) ; 
        
        }
        await user.save() ; 
        return res.json(user.cartItems) ; 

    }catch(err) {
        console.error(err) ;
        res.status(500).json({message : 'Failed to add to cart'}) ;
    }

}

export const removeAllFromCart = async (req,res) => {
    try {
        const {productId} = req.body ; 
        if(!productId) return res.status('Product Not found') ; 
        else {
            user.cartItems.remove(productId) ;

        }
        await user.save() ;
        return res.json(user.cartItems) ;

    }catch(err) {
        console.log(err.message) ;
        res.status(500).json({message : 'Failed to remove from cart'}) ; 

    }
};


export const updateQuantity = async (req,res) => {
    try {
        const { id : productId} = req.params ; 
        const { quantity }  = req.body ; 
        const userId = req.userId ;  
        const user = await User.findById(userId) ; 
        const existingItem = user.cartItems.find((item) => item.id === productId ) ; 
        
        if(!existingItem) return res.status('Product Not found') ; 
        if(existingItem) {
            existingItem.quantity = quantity ;
            if(existingItem.quantity === 0) {
                user.cartItems.remove(productId) ;
                await user.save() ;
                return res.json(user.cartItems) ;
            }else {
                return res.json('product is not available in your cart') ; 
            }
        }
        await user.save() ;
        return res.json(user.cartItems) ;
        

    }catch(err) {
        console.log(err.message) ;
        res.status(500).json({message : 'Failed to update quantity'}) ;
    }
}

