import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = ({setIsLoggedIn}) => {

  const navigate = useNavigate();

  const handleLogin = (e) =>{
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/');
  };
  return (
    <div className='flex justify-center items-center h-screen'>

      <form onSubmit={handleLogin} className='bg-gray-800 p-6 rounded-lg shadow-md w-80'>

        <h2 className='text-white text-xl mb-4'>Login</h2>

        <input type='emial' placeholder='Email' className='w-full p-2 mb-3 rounded bg-gray-700 text-white' required />

        <input type='password' placeholder='Password' className='w-full p-2 mb-3 rounded bg-gray-700 text-white' required />

        <button type='submit' className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded '>  
          Login
        </button>

      </form>

    </div>
  )
}

export default Login
