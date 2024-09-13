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
    },
    checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("api/auth/getMe");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
    refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("api/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

    
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);