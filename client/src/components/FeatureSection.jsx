import React from 'react'
import { useNavigate } from 'react-router-dom'

const FeatureSection = () => {

    const navigate = useNavigate();

  return (
    <section id='features-section' className='bg-gray-900 py-16 text-white text-center'>
        <h2 className='text-3xl font-bold mb-4'>
            What You Can Explore
        </h2>
        <p className='text-gray-400 max-w-2xl mx-auto mb-10'>
            Divine into a variety of resourses designed to help you learn & grow in your carrer.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto'>

            <div onClick={()=>navigate('/courses')} className='bg-gray-800 p-6 rounded-lg 
            shadow-md hover:shodow-xl hover:bg-gray-700 transition cursor-pointer'>
                <h3 className='text-xl font-semibold'>
                    Courses
                </h3>
                <p className='mt-2 text-gray-400'>Learn AI,ML,Data Analytics & more with  structured courses.</p>
                <span className='inline-block mt-4 text-yellow-400 hover:underline'>Explore</span>

            </div>
            <div onClick={()=>navigate('/hackathons')} className='bg-gray-800 p-6 rounded-lg 
            shadow-md hover:shodow-xl hover:bg-gray-700 transition cursor-pointer'>
                <h3 className='text-xl font-semibold'>
                    Hakcathons
                </h3>
                <p className='mt-2 text-gray-400'>Participate in coding challenges & improve your skills.</p>
                <span className='inline-block mt-4 text-yellow-400 hover:underline'>Explore</span>
            </div>
            <div onClick={()=>navigate('/jobrole')} className='bg-gray-800 p-6 rounded-lg 
            shadow-md hover:shodow-xl hover:bg-gray-700 transition cursor-pointer'>
                <h3 className='text-xl font-semibold'>
                    Job Roles
                </h3>
                <p className='mt-2 text-gray-400'>Explore Different tech roles & required skills.</p>
                <span className='inline-block mt-4 text-yellow-400 hover:underline'>Explore</span>
            </div>
            <div onClick={()=>navigate('/roadmaps')} className='bg-gray-800 p-6 rounded-lg 
            shadow-md hover:shodow-xl hover:bg-gray-700 transition cursor-pointer'>
                <h3 className='text-xl font-semibold'>
                    Roadmaps
                </h3>
                <p className='mt-2 text-gray-400'>Step By step guides for your tech career path.</p>
                <span className='inline-block mt-4 text-yellow-400 hover:underline'>Explore</span>
            </div>
            <div onClick={()=>navigate('/content')} className='bg-gray-800 p-6 rounded-lg 
            shadow-md hover:shodow-xl hover:bg-gray-700 transition cursor-pointer'>
                <h3 className='text-xl font-semibold'>
                    Content  Library
                </h3>
                <p className='mt-2 text-gray-400'>Access PDFs,videos,quizzes & more learning materials.</p>
                <span className='inline-block mt-4 text-yellow-400 hover:underline'>Explore</span>

            </div>

        </div>

    </section>
  )
}

export default FeatureSection