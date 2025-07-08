import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '../@/components/ui/sonner'
import SidebarLayout from './layouts/SidebarLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import Fixtures from './pages/Fixtures'
import Players from './pages/Players'
import Tables from './pages/Tables'

export default function App() {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Public route (no sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes (with sidebar) */}
        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/players" element={<Players />} />
          <Route path="/tables" element={<Tables />} />
        </Route>
      </Routes>
    </>
  )
}
