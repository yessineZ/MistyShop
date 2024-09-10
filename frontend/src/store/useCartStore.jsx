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

    calculateTotals : () => {
        const { coupon , cart} = get() ; 
        const subtotal = cart.reduce((sum,item) => sum + item.price * item.quantity ,0 ) ; 
        let total = subtotal ; 
        if(coupon) {
            total = total - (total * coupon.discount) / 100 ;
        }
    }

}))