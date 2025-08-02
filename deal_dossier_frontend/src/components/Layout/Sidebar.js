import React from 'react'
import { 
  Home, 
  FolderOpen, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  CheckSquare, 
  Upload,
  Settings,
  Users,
  Shield
} from 'lucide-react'

// PUBLIC_INTERFACE
const Sidebar = () => {
  /**
   * Sidebar navigation component with project sections and menu items
   * @returns {JSX.Element} Sidebar component
   */
  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: true },
    { icon: FolderOpen, label: 'Projects', href: '/projects' },
    { icon: Upload, label: 'Upload Files', href: '/upload' },
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: MessageSquare, label: 'Comments', href: '/comments' },
    { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  ]

  const adminItems = [
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Shield, label: 'Audit Log', href: '/admin/audit' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ]

  const reportSections = [
    { label: 'Executive Summary', subsections: ['Key Metrics', 'Risk Assessment'] },
    { label: 'Financial Analysis', subsections: ['P&L Analysis', 'Balance Sheet', 'Cash Flow'] },
    { label: 'Market Analysis', subsections: ['Industry Overview', 'Competition', 'Growth Trends'] },
    { label: 'Operations', subsections: ['Key Processes', 'Technology Stack', 'Team Structure'] },
    { label: 'Legal & Compliance', subsections: ['Contracts', 'IP Portfolio', 'Regulatory'] },
  ]

  return (
    <div className="sidebar-content">
      {/* Logo */}
      <div className="sidebar-header">
        <h2 className="text-lg font-bold text-primary">Deal Dossier</h2>
        <p className="text-xs text-muted">Project Alpha</p>
      </div>

      {/* Main Navigation */}
      <nav className="nav-section">
        <div className="nav-section-title">Navigation</div>
        {navigationItems.map((item) => (
          <a 
            key={item.label} 
            href={item.href} 
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon size={16} />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Report Sections */}
      <div className="nav-section">
        <div className="nav-section-title">Report Sections</div>
        <div className="report-tree">
          {reportSections.map((section) => (
            <div key={section.label} className="report-section">
              <div className="report-section-header">
                <ChevronIcon />
                <span className="report-section-title">{section.label}</span>
              </div>
              <div className="report-subsections">
                {section.subsections.map((subsection) => (
                  <a 
                    key={subsection} 
                    href={`/reports/${section.label.toLowerCase()}/${subsection.toLowerCase()}`}
                    className="report-subsection"
                  >
                    {subsection}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Section */}
      <div className="nav-section">
        <div className="nav-section-title">Administration</div>
        {adminItems.map((item) => (
          <a key={item.label} href={item.href} className="nav-item">
            <item.icon size={16} />
            {item.label}
          </a>
        ))}
      </div>

      <style jsx>{`
        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-header {
          padding: 1.5rem 1rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .report-tree {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .report-section {
          margin-bottom: 0.25rem;
        }
        
        .report-section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: var(--radius);
          margin: 0 0.5rem;
          transition: background-color 0.2s ease;
        }
        
        .report-section-header:hover {
          background-color: var(--bg-tertiary);
        }
        
        .report-section-title {
          flex: 1;
        }
        
        .report-subsections {
          margin-left: 1.5rem;
        }
        
        .report-subsection {
          display: block;
          padding: 0.375rem 1rem;
          color: var(--text-muted);
          font-size: 0.8125rem;
          text-decoration: none;
          border-radius: var(--radius);
          margin: 0.125rem 0.5rem;
          transition: all 0.2s ease;
        }
        
        .report-subsection:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}

// Simple chevron icon component
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default Sidebar
