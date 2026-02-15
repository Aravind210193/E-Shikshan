import React from 'react'
import { useParams } from 'react-router-dom';
import foldersData from '../data/folders.json';
import Folder from '../components/Folder'
const Folders = () => {
    const {subjectId,branchId} = useParams();
    const pdflist = foldersData[branchId]?.[subjectId] || [];
    const openPDF = (filepath) =>{
        window.open(filepath,"_blank");
    };

  return (
    <div className='min-h-screen text-white bg-gray-900 p-6' >
        <h1 className='text-2xl font-bold mb-6'> 
            {subjectId.toUpperCase()} - PDFS</h1>

        <div className='flex flex-col justify-center gap-6'>
            {
                pdflist.map((pdf,index)=>(
                    <div 
                    key={index}  onClick={()=>openPDF(pdf.link)}
                    target="_blank"
                     className='cursor-pointer custom-folder w-50 h-auto bg-yellow-500 text-black rounded-lg p-6 shadow-md transition'>
                        {pdf.title}</div>
                ))
                
            }
            {/* <Folder size={1} color="#5227FF" className="custom-folder w-20" /> */}

        </div>
    </div>
  )
}

export default Folders

