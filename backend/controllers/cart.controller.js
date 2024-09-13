import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        const products = await Product.find({ _id: { $in: user.cartItems } });

        

        const cartItems = products.map((product) => {
            const item = user.cartItems.find(cartItem => cartItem._id.equals(product._id)); 
            return {
                product,
                quantity: item.quantity,
            };
        });

        return res.json({ cartItems });
    } catch (err) {
        console.log('Error in getCartProducts controller:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addToCart = async (req,res) => {
    try {
        const { productId}  = req.body ;
        const userId = req.userId ;

        const user = await User.findById(userId)  ; 

        const existingItem = user.cartItems.find((item) => item.id === productId ) ;
        
        console.log(existingItem) ;  
        
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
        const userId = req.userId ;
        const user = await User.findById(userId)  ;
        const {productId} = req.body ; 
        console.log(productId) ; 
        if(!productId) return res.json('Product Not found') ; 
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


export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const userId = req.userId;
        const user = await User.findById(userId);
		const existingItem = user.cartItems.find((item) => item.id === productId);
        console.log(existingItem)  ;
		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
