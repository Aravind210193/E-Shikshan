import React from 'react'
import Features from './Features'



const FeatureSection = () => {

  return (
    <section id='features-section' className='bg-gray-900 py-12 sm:py-16 md:py-20 text-white text-center px-4 sm:px-6'>\n        <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4'>\n            What You Can Explore\n        </h2>\n        <p className='text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-4'>\n            Divine into a variety of resourses designed to help you learn & grow in your carrer.\n        </p>\n            <Features \n                textAutoHide={true}\n                enableStars={true}\n                enableSpotlight={true}\n                enableBorderGlow={true}\n                enableTilt={true}\n                enableMagnetism={true}\n                clickEffect={true}\n                spotlightRadius={300}\n                particleCount={12}\n                glowColor=\"132, 0, 255\"\n                />\n        \n\n    </section>\n  )\n}\n\nexport default FeatureSection