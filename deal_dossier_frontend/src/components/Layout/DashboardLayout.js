import React, { useState } from 'react'
import { Menu, Search, Bell, User, Settings, Upload, X, ChevronRight } from 'lucide-react'
import Sidebar from './Sidebar'
import EvidencePanel from './EvidencePanel'
import { useAuth } from '../../contexts/AuthContext'

// PUBLIC_INTERFACE
const DashboardLayout = ({ children }) => {
  /**
   * Main dashboard layout with sidebar, top navigation, and evidence panel
   * @param {Object} props - Component props
   * @param {React.ReactNode} props.children - Main content
   * @returns {JSX.Element} Dashboard layout
   */
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { signOut, user } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <div className="top-nav">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={16} />
          </button>

          <div className="search-container">
            <div className="search-icon">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search projects, files, reports..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm">
              <Upload size={16} />
              Upload
            </button>
            
            <button className="btn btn-secondary btn-sm">
              <Bell size={16} />
            </button>

            <div className="user-menu">
              <button className="btn btn-secondary btn-sm">
                <User size={16} />
                {user?.email}
              </button>
              <div className="user-dropdown">
                <button className="dropdown-item" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setEvidencePanelOpen(!evidencePanelOpen)}
            >
              {evidencePanelOpen ? <X size={16} /> : <ChevronRight size={16} />}
              Evidence
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="main-panel">
            {children}
          </div>

          {/* Evidence Panel */}
          <div className={`evidence-panel ${!evidencePanelOpen ? 'collapsed' : ''}`}>
            <EvidencePanel />
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-menu {
          position: relative;
        }
        
        .user-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          min-width: 160px;
          z-index: 10;
          display: none;
        }
        
        .user-menu:hover .user-dropdown {
          display: block;
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          border: none;
          background: none;
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: var(--bg-secondary);
        }
      `}</style>
    </div>
  )
}

export default DashboardLayout
