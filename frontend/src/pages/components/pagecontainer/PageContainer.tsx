import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <div className='p-6 md:p-10  max-h-[calc(100vh-7rem)] bg-gray-50 text-gray-900 rounded-lg overflow-auto'>
      {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-auto">{children}</div>
    </div>
  )
}

export default PageContainer
