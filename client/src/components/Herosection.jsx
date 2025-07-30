import React from 'react'
import { Link } from 'react-router-dom'

const Herosection = () => {
    const scrollToFeatures = () =>{
      const section=  document.getElementById('features-section');
        if(section){
            section.scrollIntoView({behavior:"smooth"});
        }
    };
  return (
    <section className='relative 
    text-white h-[80vh] flex flex-col justify-center items-center text-center px-6'>

        <h1 className='text-4xl md:text-6xl font-bold leading-tight'>
            Learn Smarter. Build Your Future
        </h1>

        <p className='mt-4 text-lg md:text-xl text-gray-200 max-w-2xl'>

            Welcome  To <span className='font-semibold text-white'>E-Shikshan</span>
            Explore AI,ML,Data Analytics,Competative Exams,Hackathos,Labs & more!
        </p>

        <div className='mt-6 flex flex-col md:flex-row gap-4'>

        <Link to='/courses'  className='px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md'>
                Explore Courses
            </Link>
            
            <button onClick={scrollToFeatures} className='px-6 py-3 border border-gray-300 hover:bg-white hover:text-black font-semibold rounded-md'>
                Get Started
            </button>
            </div>

            <div className='absolute bottom-6 text-gray-300 animate-bounce'>
                    Scroll To Explore
            </div>
    </section>
  )
}

export default Herosection