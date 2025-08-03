import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from '../@/components/ui/sonner';

import SidebarLayout from './layouts/SidebarLayout';
import ProtectedRoute from './pages/ProtectedRoute';
import PageSkeleton from './components/PageSkeleton'; //  import skeleton loader

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Teams = lazy(() => import('./pages/Teams'));
const Fixtures = lazy(() => import('./pages/Fixtures'));
const Players = lazy(() => import('./pages/Players'));
const Tables = lazy(() => import('./pages/Tables'));
const Events = lazy(() => import('./pages/Events'));

export default function App() {
  return (
    <>
      <Toaster />

      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/players" element={<Players />} />
            <Route path="/tables" element={<Tables />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
