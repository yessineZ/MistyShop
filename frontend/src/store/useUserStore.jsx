import {create } from 'zustand' ; 
import {toast} from 'react-hot-toast' ; 
import axios from 'axios' ; 


export const useAuthStore = create((set,get) => ({
    user : null , 
    loading : false , 
    checkingAuth : true , 
    checkUser : () => {
        console.log(get('user')) ; 
    },

    setUser: (user) => set({user}),

    getMe : async () => {
        set({loading : true}) ; 
        
        try {
            const res = await axios.get('/api/auth/getMe') ; 
            set({user : res.data.user, loading : false , checkingAuth : false }) ; 
        }catch(err) {
            console.log(err.message) ; 
            set({loading : false}) ; 
            toast.error('Failed to get user') ;
        }
    },

    logout : async () => {
        set({user : null, loading : false}) ; 
        
        try {
            const response = await axios.get('/api/auth/logout') ; 
            toast.success(response.data?.message || 'logout successfully') ;

        }catch(err) {
            console.log(err.message) ; 
            toast.error('Failed to logout') ;
        }finally {
            set({loading : false}) ;
        }
    }

    
}))