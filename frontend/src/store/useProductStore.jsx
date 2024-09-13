import { create } from 'zustand'; 
import toast from 'react-hot-toast';
import axios from 'axios'; 

export const useProductStore = create((set,get) => ({
    products: [], 
    loading: false, 
    featuredProducts : [],

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/products');
            console.log(response) ; 
            set({ products: response.data.products, loading: false });
        } catch (error) {
            console.error('Fetch Products Error:', error);
            toast.error('Failed to fetch products');
            set({ loading: false });
        }
    },

    createProduct: async (product) => {
        set({ loading: true });
        try {
            const response = await axios.post('/api/products', product);
            if (response.status === 201) {
            
                toast.success('Product added successfully'); 
                set((state) => ({
                    products: [...state.products, response.data.product], 
                    loading: false
                }));
            }
        } catch (error) {
            console.error('Create Product Error:', error);
            toast.error('Failed to add product');
            set({ loading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.delete(`/api/products/delete/${id}`);
            if (response.status === 200) {
                toast.success('Product deleted successfully');
                set((state) => ({
                    products: state.products.filter(product => product._id !== id), 
                    loading: false
                }));
            }
        } catch (error) {
            console.error('Delete Product Error:', error);
            toast.error('Failed to delete product');
            set({ loading: false });
        }
    },
    getFeaturedProducts : async () => {
        set({loading : true});
        try {
        const response = await axios.get('/api/products/featured') ;
        console.log(response) ;
        set({ featuredProducts : response.data.products }) ;
        console.log(get().featuredProducts) ; 
     }catch(err) {
        console.log(err.message) ;
        toast.error('Failed to get featured products') ;
    }finally{
        set({loading : false}) ;
    }
 },

    toggleFeaturedProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/api/products/toogle/${id}`);
            console.log(response)  ;
            if (response.status === 200) {
                toast.success(response.data.message);
                set((state) => ({
                    products: state.products.map(product => 
                        product._id === id 
                            ? { ...product, isFeatured: response.data.product.isFeatured } 
                            : product
                    ),
                    loading: false
                }));
            }
        } catch (error) {
            console.error('Toggle Featured Product Error:', error);
            toast.error('Failed to toggle featured product');
            set({ loading: false });
        }
    },
    fetchProductsByCategory : async (category) => {
        try {
            set({ loading: true });
            const response = await axios.get(`/api/products/category/${category}`);
            console.log(response) ; 
            set({ products: response.data.products, loading: false });
            
        }catch(err) {
            console.error('Fetch ProductsByCategory Error:', error);
            toast.error('Failed to fetch products by category');
        }
    } 

}));
