import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  FolderOpen, 
  Calendar, 
  Users, 
  MoreVertical,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import FileUpload from '../components/FileUpload/FileUpload'

// PUBLIC_INTERFACE
const Projects = () => {
  /**
   * Projects page component for managing deal projects
   * @returns {JSX.Element} Projects page component
   */
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [newProject, setNewProject] = useState({ name: '', description: '' })
  const { user } = useAuth()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      // Mock projects data for now
      setProjects([
        {
          id: '1',
          name: 'TechCorp Acquisition',
          description: 'Due diligence for TechCorp acquisition by BigCorp',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-20T15:30:00Z',
          files_count: 24,
          reports_count: 5,
          status: 'active'
        },
        {
          id: '2',
          name: 'RetailCo Analysis',
          description: 'Market analysis and financial review of RetailCo',
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-19T11:20:00Z',
          files_count: 18,
          reports_count: 3,
          status: 'active'
        },
        {
          id: '3',
          name: 'StartupX Due Diligence',
          description: 'Pre-investment due diligence for StartupX',
          created_at: '2024-01-05T14:00:00Z',
          updated_at: '2024-01-18T16:45:00Z',
          files_count: 12,
          reports_count: 2,
          status: 'completed'
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Error loading projects:', error)
      setLoading(false)
    }
  }

  const createProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProject.name,
          description: newProject.description,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      setProjects(prev => [data, ...prev])
      setShowCreateModal(false)
      setNewProject({ name: '', description: '' })
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project. Please try again.')
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="projects-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold">Projects</h1>
          <p className="text-secondary">Manage your deal analysis projects</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Files
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-icon">
                <FolderOpen size={24} />
              </div>
              <div className="project-menu">
                <button className="menu-trigger">
                  <MoreVertical size={16} />
                </button>
                <div className="menu-dropdown">
                  <button className="menu-item">
                    <Eye size={14} />
                    View
                  </button>
                  <button className="menu-item">
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button className="menu-item text-error">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="project-content">
              <h3 className="project-name">{project.name}</h3>
              <p className="project-description">{project.description}</p>
              
              <div className="project-stats">
                <div className="stat">
                  <span className="stat-value">{project.files_count}</span>
                  <span className="stat-label">Files</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{project.reports_count}</span>
                  <span className="stat-label">Reports</span>
                </div>
              </div>

              <div className="project-meta">
                <div className="project-date">
                  <Calendar size={14} />
                  {new Date(project.updated_at).toLocaleDateString()}
                </div>
                <div className={`project-status status-${project.status}`}>
                  {project.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="empty-state">
          <FolderOpen size={48} className="empty-icon" />
          <h3>No projects found</h3>
          <p>Create your first project to get started with deal analysis</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Create Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Project</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="project-name">Project Name</label>
                <input
                  id="project-name"
                  type="text"
                  className="input"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  className="textarea"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter project description"
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={createProject}
                disabled={!newProject.name.trim()}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Files Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Files</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="upload-project">Select Project</label>
                <select
                  id="upload-project"
                  className="select"
                  value={selectedProject || ''}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Choose a project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProject && (
                <FileUpload 
                  projectId={selectedProject}
                  onUploadComplete={() => {
                    setShowUploadModal(false)
                    loadProjects()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .projects-page {
          padding: 0;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .search-filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
          position: relative;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .project-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease;
          position: relative;
        }
        
        .project-card:hover {
          box-shadow: var(--shadow-md);
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .project-icon {
          width: 48px;
          height: 48px;
          background-color: var(--bg-secondary);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
        }
        
        .project-menu {
          position: relative;
        }
        
        .menu-trigger {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius);
          transition: all 0.2s ease;
        }
        
        .menu-trigger:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        .menu-dropdown {
          position: absolute;
          top: calc(100% + 0.25rem);
          right: 0;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          min-width: 120px;
          z-index: 10;
          display: none;
        }
        
        .project-menu:hover .menu-dropdown {
          display: block;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: none;
          border: none;
          text-align: left;
          color: var(--text-primary);
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 0.875rem;
        }
        
        .menu-item:hover {
          background-color: var(--bg-secondary);
        }
        
        .project-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .project-description {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        
        .project-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
        }
        
        .stat {
          text-align: center;
        }
        
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .project-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .project-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .project-status {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-active {
          background-color: rgb(16 185 129 / 0.1);
          color: var(--success);
        }
        
        .status-completed {
          background-color: rgb(59 130 246 / 0.1);
          color: var(--info);
        }
        
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgb(0 0 0 / 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        
        .modal {
          background-color: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 90vw;
          max-width: 500px;
          max-height: 90vh;
          overflow: auto;
        }
        
        .upload-modal {
          max-width: 800px;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .modal-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid var(--border);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .header-actions {
            justify-content: center;
          }
          
          .search-filters {
            flex-direction: column;
          }
          
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Projects
