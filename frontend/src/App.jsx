import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { AppLayout } from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/tickets/TicketList';
import TicketCreate from './pages/tickets/TicketCreate';
import TicketDetail from './pages/tickets/TicketDetail';
import UserList from './pages/users/UserList';

function ProtectedRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuthStore();
  if (!user || user.userType !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const { user, logout } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-background text-text">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          <Route element={
            <ProtectedRoute>
              <AppLayout user={user} onLogout={logout} />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/new" element={<TicketCreate />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            
            <Route path="/users" element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            } />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
