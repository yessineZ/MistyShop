import {create} from 'zustand' ; 
import axios from 'axios' ; 
import toast from 'react-hot-toast';


export const useCartStore = create((set,get) => ({
    cart : [] , 
    coupon : null , 
    total : 0 , 
    subtotal : 0 , 

    getCartItems : async () => {
        try {
            const res = await axios.get('/api/cart/getCart') ; 
            get().calculateTotals() ; 
            set({cart : res.data.cartItems}) ;
        }catch(err) {
            set({ cart : []}) ; 
            console.log(err.message) ;
            toast.error(err.message || 'failed to get cart') ;
        }
    },

   addToCart: async (product) => {
    try {
        const res = await axios.post('/api/cart', { productId: product._id });
        
        set((prevState) => {
            const existingItem = prevState.cart.find((item) => item._id === product._id);
            let newCart = [];

            if (existingItem) {
                newCart = prevState.cart.map((item) => 
                    item._id === product._id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                newCart = [...prevState.cart, { ...product, quantity: 1 }];
            }

            return { cart: newCart };
        });

        toast.success('Product added to cart');
    } catch (err) {
        console.log(err.message);
        toast.error(err.message || 'Failed to add to cart');
    }
},

removeFromCart : async (productId) => {
    try {
        console.log('in removing from cart'+productId) ;
          
        const res = await axios.delete('/api/cart',{
            data : { productId: productId }    
        });
        console.log(res) ; 
        set((prevState) => {
            return { cart: prevState.cart.filter((item) => item.product._id !== productId) };
        });
        get().calculateTotals() ; 

    }catch(err) {
        console.log(err.message) ;
        toast.error('Failed to remove from cart') ;
    }
},
updateQuantity : async (productId, quantity) => {
    try {
        if(quantity === 0) {
            get().removeFromCart(productId) ; 
            return ;
        }
        const res = await axios.put(`/api/cart/${productId}`, { quantity });
        set((prevState) => {
            return { cart: prevState.cart.map((item) => 
                    item.product._id === productId 
                       ? {...item, quantity } 
                       : item
                )};
        });
        get().calculateTotals() ;
     } catch(err) {
        console.log(err.message) ;
        toast.error('Failed to update quantity') ;
    }
},
    calculateTotals : () => {
        const { coupon , cart} = get() ; 
        const subtotal = cart.reduce((sum,item) => sum + item.product.price * item.product.quantity ,0 ) ; 
        let total = subtotal ; 
        if(coupon) {
            total = total - (total * coupon.discount) / 100 ;
        }
    }

}));