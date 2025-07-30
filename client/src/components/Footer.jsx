import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='border-r-gray-900 text-gray-300 py-8 mt-10'>
    <div className='container mx-auto px-6'>

      <div className='flex flex-col md:flex-row justify-between items-center md:items-start gap-8'>

        <div className='text-center md:text-left'>

          <h2 className='text-2xl font-bold text-white'>E-Shikshan</h2>

          <p className='text-sm text-gray-400 mt-2'>Beyond Learning-Explore. Learn. Grow</p>
        </div>
        <div>
        <h3 className='text-white font-semibold mb-2'> Quick Links </h3>

          <ul className='space-y-2 text-sm'>

            <li><Link to='/' className='hover:text-white'> Home</Link></li>
            <li><Link to='/courses' className='hover:text-white'>Courses</Link></li>
            <li><Link to='/' className='hover:text-white'>About</Link></li>
            <li><Link to='/' className='hover:text-white'> Contact</Link></li>
          </ul>
        </div>
        <div>
        <h3 className='text-white font-semibold mb-2'> Resourses </h3>

          <ul className='space-y-2 text-sm'>

            <li><Link to='/' className='hover:text-white'> FAQ</Link></li>
            <li><Link to='/courses' className='hover:text-white'>Privacy</Link></li>
            <li><Link to='/' className='hover:text-white'>Terms&Conditions</Link></li>
          </ul>
        </div>
      </div>
                  <div className='border-t border-gray-700 my-6'></div>
            <div className='text-center text-sm text-gray-500'>
              &copy; {
                new Date().getFullYear()
              }
              <span className='text-white'> E-Shikshan</span> All Rights Reserved.
            </div>
    </div>
    </footer>
  )
}

export default Footer