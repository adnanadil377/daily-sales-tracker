import { Button } from '@/components/ui/button'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-black shadow-lg text-amber-100 py-4 px-6 sm:px-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-wide">
          Daily Sales Report
        </h1>
        <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded">
          Login
        </button>
      </div>
    </header>
  )
}

export default Header
