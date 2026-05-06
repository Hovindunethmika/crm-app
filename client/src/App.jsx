import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute><Layout><Leads /></Layout></ProtectedRoute>
          } />
          <Route path="/leads/:id" element={
            <ProtectedRoute><Layout><LeadDetail /></Layout></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;