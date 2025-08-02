import React, { useState } from 'react'
import { FileText, Play, ExternalLink, Clock } from 'lucide-react'

// PUBLIC_INTERFACE
const EvidencePanel = () => {
  /**
   * Evidence panel component showing source materials and traceability
   * @returns {JSX.Element} Evidence panel component
   */
  const [activeTab, setActiveTab] = useState('sources')

  const evidenceItems = [
    {
      id: 1,
      type: 'document',
      title: 'Financial Statements 2023.pdf',
      page: 15,
      line: 23,
      content: 'Total Revenue: $2.4M',
      timestamp: null,
      relevance: 95
    },
    {
      id: 2,
      type: 'audio',
      title: 'Management Interview - CEO',
      page: null,
      line: null,
      content: 'We expect 40% growth in the next quarter...',
      timestamp: '00:15:32',
      relevance: 88
    },
    {
      id: 3,
      type: 'document',
      title: 'Market Research Report.docx',
      page: 7,
      line: 12,
      content: 'Market size estimated at $50B globally',
      timestamp: null,
      relevance: 82
    }
  ]

  const tabs = [
    { id: 'sources', label: 'Sources', count: evidenceItems.length },
    { id: 'related', label: 'Related', count: 5 },
    { id: 'comments', label: 'Comments', count: 3 }
  ]

  return (
    <div className="evidence-panel-content">
      <div className="evidence-header">
        <h3 className="font-semibold">Evidence Panel</h3>
        <p className="text-xs text-muted">Source traceability</p>
      </div>

      {/* Tabs */}
      <div className="evidence-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`evidence-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Evidence Items */}
      <div className="evidence-content">
        {activeTab === 'sources' && (
          <div className="evidence-list">
            {evidenceItems.map((item) => (
              <div key={item.id} className="evidence-item">
                <div className="evidence-item-header">
                  <div className="evidence-icon">
                    {item.type === 'document' ? (
                      <FileText size={14} />
                    ) : (
                      <Play size={14} />
                    )}
                  </div>
                  <div className="evidence-relevance">
                    {item.relevance}%
                  </div>
                </div>
                
                <div className="evidence-item-body">
                  <h4 className="evidence-title">{item.title}</h4>
                  
                  <div className="evidence-location">
                    {item.page && (
                      <span className="location-item">
                        Page {item.page}
                      </span>
                    )}
                    {item.line && (
                      <span className="location-item">
                        Line {item.line}
                      </span>
                    )}
                    {item.timestamp && (
                      <span className="location-item">
                        <Clock size={12} />
                        {item.timestamp}
                      </span>
                    )}
                  </div>
                  
                  <p className="evidence-content-text">
                    {item.content}
                  </p>
                  
                  <button className="evidence-link">
                    <ExternalLink size={12} />
                    View Source
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'related' && (
          <div className="tab-content">
            <p className="text-sm text-muted">Related evidence items will appear here</p>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="tab-content">
            <p className="text-sm text-muted">Comments and discussions will appear here</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .evidence-panel-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-secondary);
        }
        
        .evidence-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border);
        }
        
        .evidence-tabs {
          display: flex;
          border-bottom: 1px solid var(--border);
        }
        
        .evidence-tab {
          flex: 1;
          padding: 0.75rem 0.5rem;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          transition: all 0.2s ease;
        }
        
        .evidence-tab.active {
          color: var(--text-primary);
          background-color: var(--bg-primary);
          border-bottom: 2px solid var(--accent);
        }
        
        .tab-count {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          padding: 0.125rem 0.375rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .evidence-tab.active .tab-count {
          background-color: var(--accent);
          color: white;
        }
        
        .evidence-content {
          flex: 1;
          overflow-y: auto;
        }
        
        .evidence-list {
          padding: 0.5rem;
        }
        
        .evidence-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        
        .evidence-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background-color: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
        }
        
        .evidence-icon {
          color: var(--text-secondary);
        }
        
        .evidence-relevance {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
        }
        
        .evidence-item-body {
          padding: 0.75rem;
        }
        
        .evidence-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .evidence-location {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .location-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-secondary);
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
        }
        
        .evidence-content-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        
        .evidence-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--accent);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s ease;
        }
        
        .evidence-link:hover {
          opacity: 0.8;
        }
        
        .tab-content {
          padding: 1rem;
        }
      `}</style>
    </div>
  )
}

export default EvidencePanel
