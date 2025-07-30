import React from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = () => {

  const navigate = useNavigate();

  const handleSignup = (e) =>{
    e.preventDefault();
    navigate('/login');
  };
  return (
    <div className='flex justify-center items-center h-screen'>

      <form onSubmit={handleSignup} className='border-r-gray-800 p-6 rounded-lg shadow-md w-80' >
          <h2 className='text-white text-xl mb-4'>Sign Up</h2>

          <input type='text' placeholder='Full name' className='w-full p-2 mb-3 rounded bg-gray-700 text-white' required />
          <input type='email' placeholder='Email' className='w-full p-2 mb-3 rounded bg-gray-700 text-white' required />
          <input type='password' placeholder='Password' className='w-full p-2 mb-3 rounded bg-gray-700 text-white' required />

          <button type='submit' className='w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded'>
            Sign Up
          </button>
      </form>
    </div>
  )
}

export default Signin