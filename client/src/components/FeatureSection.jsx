import React from 'react'
import Features from './Features'



const FeatureSection = () => {

  return (
    <section id='features-section' className='bg-gray-900 py-16 text-white text-center'>       
        <h2 className='text-3xl font-bold mb-4'>
            What You Can Explore
        </h2>
        <p className='text-gray-400 max-w-2xl mx-auto mb-10'>
            Divine into a variety of resourses designed to help you learn & grow in your carrer.
        </p>
            <Features
                textAutoHide={true}
                enableStars={true}
                enableSpotlight={true}
                enableBorderGlow={true}
                enableTilt={true}
                enableMagnetism={true}
                clickEffect={true}
                spotlightRadius={300}
                particleCount={12}
                glowColor="132, 0, 255"
                />


    </section>
  )
}

export default FeatureSection