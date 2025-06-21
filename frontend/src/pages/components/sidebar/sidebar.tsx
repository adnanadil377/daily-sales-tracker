import { Menu, X, Home, Folder, Settings, Box, ShoppingCart } from 'lucide-react'
import { useRef, useState } from 'react'
import { useClickOutside } from '../clickoutside/useClickOutside'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  useClickOutside(sidebarRef, () => {
    if (isOpen) setIsOpen(false)
  })

  const handleClose = () => setIsOpen(false)


  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 p-2 rounded-md text-black z-[1001] bg-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} />: <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 backdrop-blur-[1px] bg-opacity-50 z-[1000] md:hidden" />
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full md:h-[90vh] w-64 bg-white/50 md:bg-white text-black transform transition-transform duration-300 ease-in-out z-[1001]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block shadow-lg md:shadow-none`}
      >
        <nav className="p-6 mt-10 flex flex-col gap-4">
          <SidebarItem
            icon={<Home size={20} />}
            label="Home"
            href="/"
            onClick={handleClose}
          />
          <SidebarItem
            icon={<Box size={20} />}
            label="Inventory"
            href="/inventory"
            onClick={handleClose}
          />
          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Sales"
            href="/units"
            onClick={handleClose}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            href="/settings"
            onClick={handleClose}
          />
        </nav>
      </div>
    </>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  onClick: () => void
}

function SidebarItem({ icon, label, href, onClick }: SidebarItemProps) {
  return (
    // <a
    //   href={href}
    //   onClick={onClick}
    //   className={`flex items-center w-full gap-3 p-2 rounded-md transition-colors text-sm font-medium
    //     ${isActive ? 'bg-black text-black font-semibold shadow-md shadow-red-500/20 border-b border-red-800' : 'hover:bg-gray-100 text-black'}`}
    // >
    //   <span className={`${isActive ? 'text-white':'text-black'}`}>{icon}</span>
    //   <span className={`${isActive ? 'text-white':'text-black'}`}>{label}</span>
    // </a> 
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center w-full gap-3 p-2 rounded-md transition-colors text-sm font-medium
        ${isActive ? 'bg-black text-white font-semibold shadow-md shadow-red-500/20 border-b border-red-800' : 'hover:bg-gray-100 text-black'}
      `}
    >
        {({ isActive }) => (
            <>
                <span className={`${isActive ? 'text-white':'text-black'}`}>{icon}</span>
                <span className={`${isActive ? 'text-white':'text-black'}`}>{label}</span>
            </>
        )}

    </NavLink>
  )
}
