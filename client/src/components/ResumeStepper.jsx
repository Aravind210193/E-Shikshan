import React from 'react'
import { useState} from 'react';
import Stepper from './Stepper.jsx';
import { Step } from './Stepper.jsx';
const ResumeStepper = () => {
     const [name,setName] = useState("");
  return (
    <div>
        <Stepper
          initialStep={1}
          onStepChange={(step) => {
            console.log(step);
          }}
          onFinalStepCompleted={() => console.log("All steps completed!")}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h2>Welcome to the Resume Building</h2>
            <p>Check out the next step!</p>
          </Step>
          <Step>
            <h2>Step 2</h2>
            
            <p>Custom step content!</p>
          </Step>
          <Step>
            <h2>How about an input?</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name?" />
          </Step>
          <Step>
            <h2>Final Step</h2>
            <p>You made it!</p>
          </Step>
          <Step>
            
          </Step>
        </Stepper>
    </div>
  )
}

export default ResumeStepper