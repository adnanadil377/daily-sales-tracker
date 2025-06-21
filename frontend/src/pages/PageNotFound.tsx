import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[90vh] bg-gray-100 text-gray-800 px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6 text-center">Sorry, the page you are looking for doesn't exist or has been moved.</p>
      <Link to="/">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md">
          Return to Homepage
        </Button>
      </Link>
    </div>
  )
}

export default PageNotFound
