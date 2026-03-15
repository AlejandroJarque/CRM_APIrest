import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ClientsPage from '../pages/clients/ClientsPage'
import ClientCreatePage from '../pages/clients/ClientCreatePage'
import ClientEditPage from '../pages/clients/ClientEditPage'
import ClientDetailPage from '../pages/clients/ClientDetailPage'
import ContactsPage from '../pages/contacts/ContactsPage'
import ContactCreatePage from '../pages/contacts/ContactCreatePage'
import ContactEditPage from '../pages/contacts/ContactEditPage'
import ActivitiesPage from '../pages/activities/ActivitiesPage'
import ActivityCreatePage from '../pages/activities/ActivityCreatePage'
import ActivityEditPage from '../pages/activities/ActivityEditPage'
import ActivityDetailPage from '../pages/activities/ActivityDetailPage'
import ProtectedRoute from './ProtectedRoute'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/create"
          element={
            <ProtectedRoute>
              <ClientCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <ClientEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:clientId/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:clientId/contacts/create"
          element={
            <ProtectedRoute>
              <ContactCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:clientId/contacts/:id/edit"
          element={
            <ProtectedRoute>
              <ContactEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <ActivitiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/create"
          element={
            <ProtectedRoute>
              <ActivityCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities/:id/edit"
          element={
            <ProtectedRoute>
              <ActivityEditPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/activities/:id"
        element={
          <ProtectedRoute>
            <ActivityDetailPage />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router