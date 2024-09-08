import React from 'react' ; 
const LoadingSpinner = ({size,...props}) => {
  return (
        <span className={`${size} loading loading-spinner text-success {...props}`}></span>
      
  )
}

export default LoadingSpinner
 