import React, { useState, useRef } from 'react'
import { User, LogOut, Settings } from 'lucide-react'
import { useClickOutside } from '../clickoutside/useClickOutside'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setDropdownOpen(false))

  return (
    <header className="bg-white shadow-lg text-black border-b py-4 px-6 sm:px-10">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded hover:bg-amber-600"
          aria-label="Toggle sidebar menu"
        >
        </button>

        {/* Title */}
      <h1 className="text-xl sm:text-2xl font-semibold tracking-wide flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
        Daily Flow
      </h1>
        {/* User Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
          >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>


          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
              <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                <User size={16} className="mr-2" />
                Profile
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                <Settings size={16} className="mr-2" />
                Settings
              </button>
              <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
