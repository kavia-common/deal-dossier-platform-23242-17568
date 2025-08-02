import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  FileText, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Table,
  Eye,
  Download,
  Share,
  Maximize2
} from 'lucide-react'

// PUBLIC_INTERFACE
const InsightsDashboard = ({ projectId, files = [] }) => {
  /**
   * Dashboard component for displaying file processing insights and visualizations
   * @param {Object} props - Component props
   * @param {string} props.projectId - Project ID
   * @param {Array} props.files - Array of processed files with insights
   * @returns {JSX.Element} Insights dashboard component
   */
  const [selectedFile, setSelectedFile] = useState(null)
  const [activeView, setActiveView] = useState('overview')
  const [insights, setInsights] = useState([])

  useEffect(() => {
    if (files.length > 0) {
      const processedFiles = files.filter(file => 
        file.insights && file.upload_status === 'completed'
      )
      setInsights(processedFiles)
      if (processedFiles.length > 0 && !selectedFile) {
        setSelectedFile(processedFiles[0])
      }
    }
  }, [files, selectedFile])

  const renderChart = (chartData, index) => {
    const { type, title, data } = chartData
    
    return (
      <div key={index} className="chart-container">
        <div className="chart-header">
          <h4 className="chart-title">{title}</h4>
          <div className="chart-actions">
            <button className="chart-action-btn">
              <Eye size={14} />
            </button>
            <button className="chart-action-btn">
              <Maximize2 size={14} />
            </button>
            <button className="chart-action-btn">
              <Download size={14} />
            </button>
          </div>
        </div>
        <div className="chart-body">
          {type === 'line' && <LineChart data={data} />}
          {type === 'bar' && <BarChart data={data} />}
          {type === 'pie' && <PieChart data={data} />}
        </div>
      </div>
    )
  }

  const renderKeyMetrics = (metrics) => {
    if (!metrics || metrics.length === 0) return null

    return (
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              {metric.confidence && (
                <span className="confidence-badge">
                  {Math.round(metric.confidence * 100)}%
                </span>
              )}
            </div>
            <div className="metric-value">{metric.value}</div>
            {metric.sheet && (
              <div className="metric-source">From: {metric.sheet}</div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderTable = (tableData, index) => {
    const { title, headers, data } = tableData
    
    return (
      <div key={index} className="table-container">
        <div className="table-header">
          <h4 className="table-title">{title}</h4>
          <button className="btn btn-sm btn-secondary">
            <Download size={14} />
            Export
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderAudioInsights = (audioInsights) => {
    const { duration, speakers, keyTopics, sentiment } = audioInsights
    
    return (
      <div className="audio-insights">
        <div className="audio-summary">
          <div className="summary-item">
            <span className="summary-label">Duration:</span>
            <span className="summary-value">{Math.floor(duration / 60)}m {duration % 60}s</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Speakers:</span>
            <span className="summary-value">{speakers.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Sentiment:</span>
            <span className={`sentiment-badge sentiment-${sentiment.overall}`}>
              {sentiment.overall} ({Math.round(sentiment.confidence * 100)}%)
            </span>
          </div>
        </div>

        <div className="speakers-section">
          <h4>Speakers</h4>
          <div className="speakers-list">
            {speakers.map((speaker, index) => (
              <div key={index} className="speaker-item">
                <div className="speaker-name">{speaker.name}</div>
                <div className="speaker-segments">{speaker.segments} segments</div>
              </div>
            ))}
          </div>
        </div>

        <div className="topics-section">
          <h4>Key Topics</h4>
          <div className="topics-list">
            {keyTopics.map((topic, index) => (
              <div key={index} className="topic-item">
                <div className="topic-header">
                  <span className="topic-name">{topic.topic}</span>
                  <span className="topic-timestamp">{topic.timestamp}</span>
                </div>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${topic.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="no-insights">
        <FileText size={48} />
        <h3>No insights available</h3>
        <p>Upload and process files to see insights and visualizations</p>
      </div>
    )
  }

  return (
    <div className="insights-dashboard">
      {/* File Selection */}
      <div className="dashboard-header">
        <div className="file-selector">
          <label htmlFor="file-select">Viewing insights for:</label>
          <select
            id="file-select"
            value={selectedFile?.id || ''}
            onChange={(e) => {
              const file = insights.find(f => f.id === e.target.value)
              setSelectedFile(file)
            }}
            className="select"
          >
            {insights.map((file) => (
              <option key={file.id} value={file.id}>
                {file.name}
              </option>
            ))}
          </select>
        </div>

        <div className="view-selector">
          <button
            className={`view-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <BarChart3 size={16} />
            Overview
          </button>
          <button
            className={`view-btn ${activeView === 'detailed' ? 'active' : ''}`}
            onClick={() => setActiveView('detailed')}
          >
            <Eye size={16} />
            Detailed
          </button>
        </div>
      </div>

      {/* Insights Content */}
      {selectedFile && (
        <div className="insights-content">
          {activeView === 'overview' && (
            <div className="overview-view">
              {/* Key Metrics */}
              {selectedFile.insights.keyMetrics && (
                <div className="section">
                  <h3 className="section-title">Key Metrics</h3>
                  {renderKeyMetrics(selectedFile.insights.keyMetrics)}
                </div>
              )}

              {/* Charts */}
              {selectedFile.insights.charts && selectedFile.insights.charts.length > 0 && (
                <div className="section">
                  <h3 className="section-title">Charts</h3>
                  <div className="charts-grid">
                    {selectedFile.insights.charts.map(renderChart)}
                  </div>
                </div>
              )}

              {/* Audio Insights */}
              {selectedFile.type.startsWith('audio/') && selectedFile.insights.speakers && (
                <div className="section">
                  <h3 className="section-title">Audio Analysis</h3>
                  {renderAudioInsights(selectedFile.insights)}
                </div>
              )}
            </div>
          )}

          {activeView === 'detailed' && (
            <div className="detailed-view">
              {/* Tables */}
              {selectedFile.insights.tables && selectedFile.insights.tables.length > 0 && (
                <div className="section">
                  <h3 className="section-title">Data Tables</h3>
                  {selectedFile.insights.tables.map(renderTable)}
                </div>
              )}

              {/* CSV Preview */}
              {selectedFile.type === 'text/csv' && selectedFile.insights.preview && (
                <div className="section">
                  <h3 className="section-title">Data Preview</h3>
                  {renderTable({ 
                    title: 'CSV Data', 
                    headers: selectedFile.insights.preview[0], 
                    data: selectedFile.insights.preview.slice(1) 
                  }, 0)}
                </div>
              )}

              {/* JSON Structure */}
              {selectedFile.type === 'application/json' && selectedFile.insights.structure && (
                <div className="section">
                  <h3 className="section-title">JSON Structure</h3>
                  <div className="json-structure">
                    <pre>{selectedFile.insights.structure}</pre>
                  </div>
                </div>
              )}

              {/* Text Content */}
              {selectedFile.insights.textContent && (
                <div className="section">
                  <h3 className="section-title">Extracted Content</h3>
                  <div className="text-content">
                    <p>{selectedFile.insights.textContent}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .insights-dashboard {
          background-color: var(--bg-primary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          background-color: var(--bg-secondary);
        }
        
        .file-selector {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .file-selector label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .file-selector select {
          min-width: 200px;
        }
        
        .view-selector {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .view-btn:hover,
        .view-btn.active {
          background-color: var(--accent);
          color: white;
          border-color: var(--accent);
        }
        
        .insights-content {
          padding: 1.5rem;
        }
        
        .section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .metric-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
        }
        
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .confidence-badge {
          background-color: var(--accent);
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
        }
        
        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .metric-source {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        
        .chart-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .chart-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .chart-action-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        
        .chart-action-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .chart-body {
          padding: 1rem;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        
        .table-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
        }
        
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .table-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .data-table th {
          background-color: var(--bg-tertiary);
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 1px solid var(--border);
        }
        
        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border-light);
          color: var(--text-secondary);
        }
        
        .data-table tr:hover {
          background-color: var(--bg-tertiary);
        }
        
        .audio-insights {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.5rem;
        }
        
        .audio-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .summary-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .summary-value {
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .sentiment-badge {
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .sentiment-positive {
          background-color: rgb(16 185 129 / 0.1);
          color: var(--success);
        }
        
        .sentiment-neutral {
          background-color: rgb(107 114 128 / 0.1);
          color: var(--text-secondary);
        }
        
        .sentiment-negative {
          background-color: rgb(239 68 68 / 0.1);
          color: var(--error);
        }
        
        .speakers-section,
        .topics-section {
          margin-bottom: 1.5rem;
        }
        
        .speakers-section h4,
        .topics-section h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        
        .speakers-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .speaker-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0.75rem;
          min-width: 120px;
        }
        
        .speaker-name {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .speaker-segments {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .topic-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0.75rem;
        }
        
        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .topic-name {
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .topic-timestamp {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .confidence-bar {
          height: 4px;
          background-color: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .confidence-fill {
          height: 100%;
          background-color: var(--accent);
          transition: width 0.3s ease;
        }
        
        .json-structure {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
          overflow-x: auto;
        }
        
        .json-structure pre {
          margin: 0;
          font-family: monospace;
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        
        .text-content {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .text-content p {
          margin: 0;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        
        .no-insights {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }
        
        .no-insights h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// Simple chart components for visualization
const LineChart = ({ data }) => (
  <div className="simple-chart">
    <BarChart3 size={32} />
    <p>Line Chart: {data.length} data points</p>
    <div className="chart-data">
      {data.map((item, i) => (
        <span key={i} className="data-point">
          {item.period}: {item.value}
        </span>
      ))}
    </div>
  </div>
)

const BarChart = ({ data }) => (
  <div className="simple-chart">
    <BarChart3 size={32} />
    <p>Bar Chart: {data.length} data points</p>
    <div className="chart-data">
      {data.map((item, i) => (
        <span key={i} className="data-point">
          {item.period}: {item.value}
        </span>
      ))}
    </div>
  </div>
)

const PieChart = ({ data }) => (
  <div className="simple-chart">
    <PieChartIcon size={32} />
    <p>Pie Chart: {data.length} segments</p>
  </div>
)

export default InsightsDashboard
