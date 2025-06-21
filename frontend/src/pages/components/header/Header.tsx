import React from 'react'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-lg text-black border-b py-4 px-6 sm:px-10">
      <div className="flex items-center justify-between">
        {/* Menu button visible only on small screens */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-amber-600"
          aria-label="Toggle sidebar menu"
        >
          <Menu size={24} className="text-amber-100" />
        </button>

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
