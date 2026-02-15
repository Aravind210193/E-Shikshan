import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Contentcard from '../components/Contentcard';
import subjectsData from '../data/subjects.json';


const Subjects = () => {

    const {branchId} = useParams();
    const [semester,setSemester] = useState("E1-S1","E1-S2");
    const semesters = Object.keys(subjectsData[branchId] || {});
    const subjects = subjectsData[branchId]?.[semester] || []; 
  return (
    <div className='min-h-screen  bg-black p-6' >
        <h1 className='text-white flex justify-center text-2xl font-bold mb-4'>
            {
                branchId.toUpperCase()   
            }
             {" "}  Subjects
        </h1>
        <select value={semester} onChange={(e)=>setSemester(e.target.value)}
            className='bg-[#1c1c1c] text-white p-2   rounded-md mb-6'>
                {
                    semesters.map((sem,i)=>(
                        <option key={i} value={sem}>{sem}</option>
                    ))
                }
        </select>
        <div className='text-white grid grid-cols-2 sm:grid-cols-3
         gap-6'>
           { subjects.map((subjects,index)=>(
            
                <Contentcard key={index} title={subjects.title} link={subjects.link} />
            ))
        }

            
        </div>

    </div>
  )
}

export default Subjects