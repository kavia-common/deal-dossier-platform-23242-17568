import React, { useState, useEffect } from 'react'
import { FolderOpen, Upload as UploadIcon, File, Trash2 } from 'lucide-react'
import FileUpload from '../components/FileUpload/FileUpload'
import { supabase } from '../lib/supabase'

// PUBLIC_INTERFACE
const Upload = () => {
  /**
   * Upload page component for managing file uploads across projects
   * @returns {JSX.Element} Upload page component
   */
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [recentFiles, setRecentFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Mock data for projects
      setProjects([
        { id: '1', name: 'TechCorp Acquisition', files_count: 24 },
        { id: '2', name: 'RetailCo Analysis', files_count: 18 },
        { id: '3', name: 'StartupX Due Diligence', files_count: 12 }
      ])

      // Mock recent files
      setRecentFiles([
        {
          id: '1',
          name: 'Financial_Statements_2023.pdf',
          project_name: 'TechCorp Acquisition',
          size: 2.4 * 1024 * 1024,
          uploaded_at: '2024-01-20T10:30:00Z',
          status: 'completed'
        },
        {
          id: '2',
          name: 'Market_Research_Report.docx',
          project_name: 'RetailCo Analysis',
          size: 1.8 * 1024 * 1024,
          uploaded_at: '2024-01-20T09:15:00Z',
          status: 'processing'
        },
        {
          id: '3',
          name: 'CEO_Interview.mp3',
          project_name: 'StartupX Due Diligence',
          size: 45 * 1024 * 1024,
          uploaded_at: '2024-01-19T16:45:00Z',
          status: 'completed'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading upload data...</p>
      </div>
    )
  }

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold">Upload Files</h1>
          <p className="text-secondary">Upload and manage project documents and media files</p>
        </div>
      </div>

      {/* Project Selection */}
      <div className="project-selection">
        <label htmlFor="project-select" className="selection-label">
          Select Project
        </label>
        <select
          id="project-select"
          className="select project-select"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Choose a project...</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name} ({project.files_count} files)
            </option>
          ))}
        </select>
      </div>

      {/* Upload Section */}
      {selectedProject ? (
        <div className="upload-section">
          <FileUpload 
            projectId={selectedProject}
            onUploadComplete={loadData}
          />
        </div>
      ) : (
        <div className="no-project-selected">
          <FolderOpen size={48} />
          <h3>Select a Project</h3>
          <p>Choose a project from the dropdown above to start uploading files</p>
        </div>
      )}

      {/* Recent Files */}
      <div className="recent-files">
        <div className="section-header">
          <h2>Recent Uploads</h2>
          <p className="text-secondary">Recently uploaded files across all projects</p>
        </div>

        <div className="files-list">
          {recentFiles.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <div className="file-icon">
                  <File size={20} />
                </div>
                <div className="file-details">
                  <h4 className="file-name">{file.name}</h4>
                  <div className="file-meta">
                    <span className="file-project">{file.project_name}</span>
                    <span className="file-separator">•</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-separator">•</span>
                    <span className="file-date">{formatDate(file.uploaded_at)}</span>
                  </div>
                </div>
              </div>

              <div className="file-actions">
                <div className={`file-status status-${file.status}`}>
                  {file.status}
                </div>
                <button className="file-action-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .upload-page {
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
          margin-bottom: 2rem;
        }
        
        .project-selection {
          margin-bottom: 2rem;
        }
        
        .selection-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .project-select {
          max-width: 400px;
        }
        
        .upload-section {
          margin-bottom: 3rem;
        }
        
        .no-project-selected {
          text-align: center;
          padding: 4rem 2rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: 3rem;
        }
        
        .no-project-selected h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem;
        }
        
        .no-project-selected p {
          color: var(--text-secondary);
        }
        
        .recent-files {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .section-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          background-color: var(--bg-secondary);
        }
        
        .section-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .files-list {
          max-height: 500px;
          overflow-y: auto;
        }
        
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }
        
        .file-item:last-child {
          border-bottom: none;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }
        
        .file-icon {
          flex-shrink: 0;
          color: var(--text-secondary);
        }
        
        .file-details {
          min-width: 0;
          flex: 1;
        }
        
        .file-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .file-separator {
          color: var(--text-muted);
        }
        
        .file-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        
        .file-status {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-completed {
          background-color: rgb(16 185 129 / 0.1);
          color: var(--success);
        }
        
        .status-processing {
          background-color: rgb(245 158 11 / 0.1);
          color: var(--warning);
        }
        
        .status-error {
          background-color: rgb(239 68 68 / 0.1);
          color: var(--error);
        }
        
        .file-action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius);
          transition: all 0.2s ease;
        }
        
        .file-action-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--error);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .file-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .file-actions {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  )
}

export default Upload
