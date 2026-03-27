
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ClientsPage from '../pages/clients/ClientsPage'
import ClientEditPage from '../pages/clients/ClientEditPage'
import ClientDetailPage from '../pages/clients/ClientDetailPage'
import ContactsPage from '../pages/contacts/ContactsPage'
import ContactEditPage from '../pages/contacts/ContactEditPage'
import ActivitiesPage from '../pages/activities/ActivitiesPage'
import ActivityEditPage from '../pages/activities/ActivityEditPage'
import ActivityDetailPage from '../pages/activities/ActivityDetailPage'
import ProfilePage from '../pages/profile/ProfilePage'
import UsersPage from '../pages/admin/UsersPage'
import UserDetailPage from '../pages/admin/UserDetailPage'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import WelcomePage from '../pages/welcome/WelcomePage'
import AllContactsPage from '../pages/contacts/AllContactsPage'
import NotesPage from '../pages/notes/NotesPage'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute title="Dashboard">
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/clients" element={
          <ProtectedRoute title="Clients">
            <ClientsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/clients/:id/edit" element={
          <ProtectedRoute title="Edit client">
            <ClientEditPage />
          </ProtectedRoute>
        } />
        <Route path="/clients/:id" element={
          <ProtectedRoute title="Client detail">
            <ClientDetailPage />
          </ProtectedRoute>
        } />

        <Route path="/clients/:clientId/contacts" element={
          <ProtectedRoute title="Contacts">
            <ContactsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/clients/:clientId/contacts/:id/edit" element={
          <ProtectedRoute title="Edit contact">
            <ContactEditPage />
          </ProtectedRoute>
        } />

        <Route path="/activities" element={
          <ProtectedRoute title="Activities">
            <ActivitiesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/activities/:id/edit" element={
          <ProtectedRoute title="Edit activity">
            <ActivityEditPage />
          </ProtectedRoute>
        } />
        <Route path="/activities/:id" element={
          <ProtectedRoute title="Activity detail">
            <ActivityDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/contacts" element={
          <ProtectedRoute title="Contacts">
            <AllContactsPage />
          </ProtectedRoute>
        } />

        <Route path="/notes" element={
          <ProtectedRoute title="Notes">
            <NotesPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute title="Profile">
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <AdminRoute title="Users">
            <UsersPage />
          </AdminRoute>
        } />
        <Route path="/admin/users/:id" element={
          <AdminRoute title="User detail">
            <UserDetailPage />
          </AdminRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router