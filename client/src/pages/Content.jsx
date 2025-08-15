import React, { useState } from 'react'
import Contentcard from '../components/Contentcard'
import branchesData from '../data/branches.json'



const Content = () => {
  const [query,setQuery] = useState(' ');
  const [selectedContent, setSelectedContent] = useState(null);
  const filtered = branchesData.filter(index => index.title.toLowerCase().includes(query.toLowerCase()));
  return (

    <div className='min-h-screen bg-gray-900 border border-gray-700 rounded-2xl p-10'>
       
      <h1 className='text-white  flex justify-center text-2xl font-bold mb-6'>
      Branches</h1>
      <div className='flex  justify-center   gap-6 items-center'>
        {  
           branchesData.map((branch,index)=>(
            
            <Contentcard key={index} title={branch.title}
          link={branch.link} />
          ))
        }
        </div> 

    </div>

  )
}

export default Content