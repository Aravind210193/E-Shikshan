import Stepper, { Step } from '../components/Stepper';

import { Link } from 'react-router-dom';


const ResumeBuilding = () => {
 
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Resume Building</h1>
      <div>
        <Link to='/resumestepper'>Choose Template</Link>
      </div>
        
    </div>
  )
}

export default ResumeBuilding