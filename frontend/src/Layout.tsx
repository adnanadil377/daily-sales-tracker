import { useState } from 'react'
import Header from './pages/components/header/Header'
import Sidebar from './pages/components/sidebar/sidebar'
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from './auth/useAuth';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner or a blank page while checking auth status
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!isAuthenticated) {
    // Redirect them to the /authorize page (or /login directly),
    // saving the current location they were trying to go to.
    // return <Navigate to="/auth" state={{ from: location }} replace />;
    // Or directly to login:
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
