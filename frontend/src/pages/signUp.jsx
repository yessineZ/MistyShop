import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Input from '../components/Input';
 import { FaUser } from "react-icons/fa";
 import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Gender from '../components/Gender';
import {Link } from 'react-router-dom' ; 
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery ,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useUserStore';

const SignUpPage = () => {

    const queryClient =  useQueryClient() ; 
    const user = useAuthStore((state) => state.user) ; 
    const { setUser } = useAuthStore(state => ({
    setUser: state.setUser,
  }));

  
  console.log(user) ; 

    const {mutate , isError , isPending ,error} = useMutation({
        mutationFn : async({email , username , password , gender}) => {
            try {
                const response = await axios.post('/api/auth/signUp',{
                    email,
                    name : username,
                    password,
                    gender
                });
                if(response.status === 201) {
                    toast.success(response.data.message) ;
                    setUser(response.data.user) ;
                  
                    console.log(response.data.user) ;
                }else {
                    toast.error(response.data.message) ;
                }
                
            }catch(err) {
                console.log(err.message) ; 
                toast.error(response.data.message) ;
            }
        }
    })


    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("hello") ; 
         if(checkBeforeSignUp(signUp)) 
        mutate(signUp) ;


        

    }


    const checkBeforeSignUp = ({email , password , confirmPassword , gender}) => {
        if(!email ||!password ||!confirmPassword ||!gender) {
            toast.error('All fields are required') ;
            return false ;
        }
        if(password.length < 6) {
            toast.error('Password must be at least 6 characters long') ;
            return false ;
        }
        if(password!== confirmPassword) {
            toast.error('Passwords do not match') ;
            return false ;
        }
        return true ;
    }

    const [signUp,setSignUp] = useState(() => {
        return {
            username : '',
            email : '',
            password : '',
            confirmPassword : '' ,
            gender : '',
        }
    }) ;

    const handleChange = (e) => {
    setSignUp({...signUp,[e.target.name]: e.target.value }) ;
        console.log(signUp) ; 
    }

  
  return (
    <motion.div 
    initial = {{opacity : 0 , y:-20}} 
    animate = {{opacity : 1 , y : 0}}
    transition={{
        duration : 0.8
    }}
    className='max-w-md mx-auto    w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex-col flex items-center justify-center'

    >
        <div className='p-8'>
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Create Account</h2>
        <form onSubmit={handleSignUp}>
            <Input placeholder="username"
                value={signUp.username}
                onChange={handleChange}
                name="username"
                type="text"
                icon={FaUser}
            />

            <Input placeholder="email"
                value={signUp.email}
                onChange={handleChange}
                name="email"
                type="email"
                icon={MdOutlineMailOutline}
            />


            <Input placeholder="password"
                value={signUp.password}
                onChange={handleChange}
                name="password"
                type="password"
                icon={RiLockPasswordFill}
            />

            <Input placeholder="confirm password"
                value={signUp.ConfirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                type="password"
                icon={RiLockPasswordFill}
            />

            <Gender setSignUp={setSignUp} signUp={signUp}/>
             
             {/* Password strength meter  */}
            <PasswordStrengthMeter password={signUp.password}/>


             <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-t from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200'
             whileTap={{scale : 0.98}}
             whileHover={{scale :1.02}}
             type='submit'
             disabled={isPending}>
            {isPending ? <LoadingSpinner size='lg'/> : 'SignUp'}

             </motion.button>




        </form>
        </div>

         <div className='px-8 bg-slate-600 py-3 flex items-center justify-center w-full hover:bg-slate-500 '>
    <p>Dont have an account ? <span className='font-bold text-[16px] hover:underline hover:text-success' ><Link to={'/login'}>Login</Link></span> </p>
        </div>



    </motion.div>
  )
}

export default SignUpPage
