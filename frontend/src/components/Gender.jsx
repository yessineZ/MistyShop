import React from 'react'

const Gender = ({setSignUp,signUp}) => {
  return (
    <div className='flex items-center justify-between max-w-6 '>
      <div className="form-control">
        <label className="cursor-pointer label">
        <span className="label-text font-bold text-lg">Male</span>
        <input type="radio" name='gender' onChange={() => setSignUp({...signUp,gender:"Male"})} className="checkbox checkbox-success ml-2" />
        </label>
      </div>


      <div className="form-control">
        <label className="cursor-pointer label">
        <span className="label-text font-bold text-lg">Female</span>
        <input type="radio" name='gender'  className="checkbox checkbox-success ml-2" onChange={() => setSignUp({...signUp,gender:"Female"})} />
        </label>
      </div>


       
      
    </div>
      
    

    





  )
}

export default Gender
