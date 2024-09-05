import React from 'react'

const Circle = ({color,isCurrent,text}) => {
  return (
    <div>

        {isCurrent && (
        <div className={`${isCurrent ? color : null} h-60 w-60 rounded-full`}>
      
        </div>
    ) }
    </div>
    
    
  )
}

export default Circle
