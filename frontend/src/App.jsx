import { useState, useEffect } from 'react'
import Circle from './Circle';
import { Routes ,Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Navbar from './components/Navbar';

function App() {
  return (

    <div className='min-h-screen bg-[#1a1919] relative overflow-hidden'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]'>
      
      </div>
      
      <div className='relative z-50 pt-20'>
          <Navbar/>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/signup' element={<SignUpPage/>} /> 
            <Route path='/login' element={<LoginPage/>} />
          
          </Routes>
      </div>
      
    </div>
  )
}

export default App;
