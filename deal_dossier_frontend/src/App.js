import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthForm from './components/Auth/AuthForm'
import DashboardLayout from './components/Layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Reports from './pages/Reports'
import Upload from './pages/Upload'
import './App.css'

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component with routing and authentication
   * @returns {JSX.Element} Application root component
   */
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

// PUBLIC_INTERFACE
const AppRoutes = () => {
  /**
   * Application routing component that handles authenticated and public routes
   * @returns {JSX.Element} Routes component
   */
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Deal Dossier...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<div>Analytics Page (Coming Soon)</div>} />
        <Route path="/comments" element={<div>Comments Page (Coming Soon)</div>} />
        <Route path="/tasks" element={<div>Tasks Page (Coming Soon)</div>} />
        <Route path="/admin/*" element={<div>Admin Section (Coming Soon)</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

const AppLoadingStyles = `
  .app-loading {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
  
  .loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border);
    border-top: 4px solid var(--accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.type = 'text/css'
styleSheet.innerText = AppLoadingStyles
document.head.appendChild(styleSheet)

export default App
