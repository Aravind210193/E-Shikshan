import React from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({title,link}) => {
    const navigate = useNavigate();
  return (
    <div
    onClick={()=>navigate(link)}
    className='bg-[#1c1c1c] rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg cursor-pointer
        hover:scale-105 transition-transform duration-300 w-full max-w-md'
    >

    </div>
  )
}

export default Card