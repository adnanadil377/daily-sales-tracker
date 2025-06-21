import React from 'react'
import PageContainer from '../pagecontainer/PageContainer'

interface ComingSoonProps{
    title?:string
}
const ComingSoon:React.FC<ComingSoonProps> =({title})=> {
  return (
    <PageContainer title="Coming Soon">
      <div className="min-h-[calc(50vh-7rem)] flex items-center justify-center px-4 ">
        <div className="w-full sm:max-w-md rounded-xl bg-neutral-100 backdrop-blur-md p-8 shadow-inner">
          <h1 className="text-xs sm:text-4xl font-bold text-center mb-4">🚧 <div className='font-serif text-xl'>{title}</div> Coming Soon</h1>
        </div>
      </div>
    </PageContainer>
  )
}

export default ComingSoon
