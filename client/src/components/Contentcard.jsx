import React from 'react'
import {useNavigate} from 'react-router-dom'
const Contentcard = ({title,link}) => {
    const navigate = useNavigate();
  return (
    <div
        onClick={()=>navigate(link)}
        className='bg-gray-700 rounded-xl flex flex-col  p-6  items-center justify-center gap-3 shadow-lg cursor-pointer
        hover:scale-105 transition-transform duration-300 w-full max-w-md'
    >
        <img src='logo.png' alt={title} className='r w-16 h-16'/>
        <h2 className='text-white text-lg font-semibold text-center'>
            {title}
        </h2>
       

    </div>
  )
}

export default Contentcard