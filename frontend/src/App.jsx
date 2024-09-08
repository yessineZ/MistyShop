import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useUserStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import Navbar from './components/Navbar';
import SignUpPage from './pages/signUp';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, getMe, loading } = useAuthStore((state) => ({
    user: state.user,
    getMe: state.getMe,
    loading: state.loading,
  }));

  useEffect(() => {
    if (!user) {
      getMe();
    }
  }, [getMe, user]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
      <LoadingSpinner/>

      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#1a1919] relative overflow-hidden'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
      <div className='relative z-50 pt-20'>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/'/>} />
          <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/'/> } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
