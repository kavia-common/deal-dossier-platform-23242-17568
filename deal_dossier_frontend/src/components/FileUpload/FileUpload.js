import React, { useState, useCallback } from 'react'
import { Upload, X, FileText, File, Music, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// PUBLIC_INTERFACE
const FileUpload = ({ projectId, onUploadComplete }) => {
  /**
   * File upload component with drag and drop support for multiple file types
   * @param {Object} props - Component props
   * @param {string} props.projectId - Project ID to associate files with
   * @param {Function} props.onUploadComplete - Callback when upload completes
   * @returns {JSX.Element} File upload component
   */
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const acceptedTypes = {
    'application/pdf': { icon: FileText, label: 'PDF' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, label: 'DOCX' },
    'application/vnd.ms-excel': { icon: File, label: 'XLS' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: File, label: 'XLSX' },
    'text/csv': { icon: File, label: 'CSV' },
    'application/json': { icon: File, label: 'JSON' },
    'audio/mpeg': { icon: Music, label: 'MP3' },
    'audio/wav': { icon: Music, label: 'WAV' },
    'audio/mp4': { icon: Music, label: 'M4A' }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    addFiles(selectedFiles)
  }

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      Object.keys(acceptedTypes).includes(file.type) && file.size <= 100 * 1024 * 1024 // 100MB limit
    )
    
    const fileObjects = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'ready',
      progress: 0,
      error: null
    }))

    setFiles(prev => [...prev, ...fileObjects])
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFiles = async () => {
    if (files.length === 0) return
    
    setUploading(true)
    
    for (const fileObj of files) {
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'uploading', progress: 0 } : f
        ))

        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${fileObj.file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(`${projectId}/${fileName}`, fileObj.file, {
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total) * 100
              setFiles(prev => prev.map(f => 
                f.id === fileObj.id ? { ...f, progress: percentage } : f
              ))
            }
          })

        if (uploadError) throw uploadError

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from('files')
          .insert({
            project_id: projectId,
            name: fileObj.name,
            type: fileObj.type,
            size: fileObj.size,
            file_url: uploadData.path,
            upload_status: 'completed',
            processing_progress: 0
          })

        if (dbError) throw dbError

        // Update status to completed
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'completed', progress: 100 } : f
        ))

      } catch (error) {
        console.error('Upload error:', error)
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error', error: error.message } : f
        ))
      }
    }

    setUploading(false)
    if (onUploadComplete) {
      onUploadComplete()
    }
  }

  const getFileIcon = (type) => {
    const fileType = acceptedTypes[type]
    if (fileType) {
      const IconComponent = fileType.icon
      return <IconComponent size={20} />
    }
    return <File size={20} />
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success" />
      case 'error':
        return <AlertCircle size={16} className="text-error" />
      default:
        return null
    }
  }

  return (
    <div className="file-upload">
      {/* Upload Area */}
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <Upload size={48} className="upload-icon" />
          <h3 className="upload-title">Drop files here or click to browse</h3>
          <p className="upload-description">
            Supports PDF, DOCX, XLS, CSV, JSON, MP3, WAV, M4A files up to 100MB
          </p>
          <input
            type="file"
            multiple
            accept={Object.keys(acceptedTypes).join(',')}
            onChange={handleFileSelect}
            className="file-input"
          />
          <button className="btn btn-primary">
            Choose Files
          </button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h4 className="font-medium">Selected Files ({files.length})</h4>
            <div className="file-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setFiles([])}
                disabled={uploading}
              >
                Clear All
              </button>
              <button 
                className="btn btn-accent btn-sm"
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </div>

          <div className="files">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="file-item">
                <div className="file-info">
                  <div className="file-icon">
                    {getFileIcon(fileObj.type)}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{fileObj.name}</div>
                    <div className="file-meta">
                      {formatFileSize(fileObj.size)} • {acceptedTypes[fileObj.type]?.label || 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="file-status">
                  {fileObj.status === 'uploading' && (
                    <div className="file-progress">
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${fileObj.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{Math.round(fileObj.progress)}%</span>
                    </div>
                  )}
                  
                  {(fileObj.status === 'completed' || fileObj.status === 'error') && (
                    <div className="status-icon">
                      {getStatusIcon(fileObj.status)}
                    </div>
                  )}

                  {fileObj.status !== 'uploading' && (
                    <button
                      className="remove-file"
                      onClick={() => removeFile(fileObj.id)}
                      disabled={uploading}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {fileObj.error && (
                  <div className="file-error">
                    <p className="text-error text-sm">{fileObj.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload {
          width: 100%;
        }
        
        .upload-area {
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: 3rem 1.5rem;
          text-align: center;
          position: relative;
          transition: all 0.2s ease;
          background-color: var(--bg-secondary);
        }
        
        .upload-area.drag-over {
          border-color: var(--accent);
          background-color: rgb(16 185 129 / 0.05);
        }
        
        .upload-content {
          position: relative;
          z-index: 2;
        }
        
        .upload-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        
        .upload-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .upload-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }
        
        .file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }
        
        .file-list {
          margin-top: 1.5rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .file-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background-color: var(--bg-secondary);
        }
        
        .file-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .files {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .file-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        
        .file-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
        }
        
        .progress {
          flex: 1;
          height: 6px;
          background-color: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          background-color: var(--accent);
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          min-width: 32px;
          text-align: right;
        }
        
        .remove-file {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        
        .remove-file:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .file-error {
          grid-column: 1 / -1;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default FileUpload
