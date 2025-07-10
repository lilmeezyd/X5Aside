import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '../@/components/ui/sonner';

import SidebarLayout from './layouts/SidebarLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Fixtures from './pages/Fixtures';
import Players from './pages/Players';
import Tables from './pages/Tables';
import ProtectedRoute from './pages/ProtectedRoute';

export default function App() {
  return (
    <>
      <Toaster />

      <Routes>
        {/* 🔓 Public route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected routes wrapped in ProtectedRoute */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/players" element={<Players />} />
          <Route path="/tables" element={<Tables />} />
        </Route>
      </Routes>
    </>
  );
}
