import React, { useState } from 'react'
import {toast} from 'react-hot-toast'
import {motion} from 'framer-motion' ; 
import Input from '../components/Input';

 import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useMutation , useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../store/useUserStore';
import LoadingSpinner from '../components/LoadingSpinner';
const LoginPage = () => {
  const [form,setForm] = useState({
    email : "",
    password : ""
  })  ;

  const user = useAuthStore((state ) => state.user) ; 

  const {setUser} = useAuthStore((state) => ({
    setUser : state.setUser
   }));

   console.log(user) ; 

   
  
  const {mutate , isError , isPending , error} = useMutation({
    mutationFn : async ({email,password}) => {
      try {
        console.log(email,password) ; 
        const response = await axios.post('/api/auth/login',{
          email,
          password
        });
        console.log(response) ; 
        if(response.data?.user) {
          setUser(response.data?.user) ; 
          toast.success(response.data.message) ; 
          return response.data.user ;
        }else {
          toast.error(response.data.message) ;
        }

      }catch(err) {
        console.log(err.message) ; 
        toast.error(response.data.message) ;
      }
    }
  });




  


  const handleSubmit = (e) => {
    e.preventDefault() ;
    if(form.email && form.password) {
    mutate(form)  ;
  }else {
    toast.error('Please fill in all fields') ;
  }
}

  const handleChange = (e) => {
    setForm({
     ...form,
      [e.target.name] : e.target.value
    }) ;
    
  } 
  
  return (
    <motion.div 
    initial={{
      opacity : 0 , 
      y : 80 
    }}
    animate={{
      opacity : 1 ,
      y : 0
    }}
    transition={{
      duration : 0.8
    }}
    className='max-w-md mx-auto w-full mt-5 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex flex-col items-center justify-center'
    >
      <div className='p-8'>
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Login</h2>
        <form onSubmit={handleSubmit}>
          <Input 
          placeholder="email"
          icon={MdOutlineMailOutline}
          value={form.email}
          onChange={handleChange}
          type="email"
          name="email"

          />

          <Input 
          placeholder="password"
          icon={RiLockPasswordFill}
          value={form.password}
          onChange={handleChange}
          type="password"
          name="password"

          />

              <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-t from-green-500 to-emerald-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200'
             whileTap={{scale : 0.98}}
             whileHover={{scale :1.02}}
             type='submit'>{isPending ? <LoadingSpinner size={15} /> : "Login"}
          
             </motion.button>

        </form>


      </div>

      <div className=' bg-slate-600 flex flex-col h-auto items-center  justify-center w-full rounded-b-xl '>
        
        <div>Dont have Account ?  <span className='ml-2 font-bold hover:text-success'><Link to={'/SignUp'}>SignUp</Link></span>  </div>
        <div className='flex justify-start hover:text-success hover:font-bold transition-all'><Link to={'/forget-password'}>Forgot Password ?</Link> </div>


        
        
      
      </div>
    </motion.div>
    
  )
  }

export default LoginPage ; 
