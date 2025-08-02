import React, { useState, useEffect } from 'react'
import { FileText, Play, ExternalLink, Clock, Zap, Target, BarChart3, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// PUBLIC_INTERFACE
const EvidencePanel = ({ projectId = null }) => {
  /**
   * Enhanced evidence panel component showing source materials and traceability from processed files
   * @param {Object} props - Component props
   * @param {string} props.projectId - Current project ID to show evidence for
   * @returns {JSX.Element} Evidence panel component
   */
  const [activeTab, setActiveTab] = useState('sources')
  const [evidenceItems, setEvidenceItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (projectId) {
      loadEvidence()
    } else {
      // Load mock data if no project selected
      loadMockEvidence()
    }
  }, [projectId])

  const loadEvidence = async () => {
    try {
      setLoading(true)
      
      // Load evidence from database
      const { data: evidence, error } = await supabase
        .from('evidence')
        .select(`
          *,
          files (
            name,
            type,
            insights
          )
        `)
        .eq('files.project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const formattedEvidence = evidence.map(item => ({
        id: item.id,
        type: item.files.type.startsWith('audio/') ? 'audio' : 'document',
        title: item.files.name,
        page: item.page_number,
        line: item.line_number,
        content: item.content,
        timestamp: item.timestamp ? formatTimestamp(item.timestamp) : null,
        relevance: Math.round((item.confidence || 0.9) * 100),
        source: item.files.name
      }))
      
      setEvidenceItems(formattedEvidence)
    } catch (error) {
      console.error('Error loading evidence:', error)
      loadMockEvidence()
    } finally {
      setLoading(false)
    }
  }

  const loadMockEvidence = () => {
    const mockEvidence = [
      {
        id: 1,
        type: 'document',
        title: 'Financial Statements 2023.pdf',
        page: 15,
        line: 23,
        content: 'Total Revenue: $2.4M (15% YoY growth)',
        timestamp: null,
        relevance: 95,
        insight: 'revenue_metric'
      },
      {
        id: 2,
        type: 'audio',
        title: 'Management Interview - CEO',
        page: null,
        line: null,
        content: 'We expect 40% growth in the next quarter driven by our expansion into European markets...',
        timestamp: '00:15:32',
        relevance: 88,
        insight: 'growth_projection'
      },
      {
        id: 3,
        type: 'document',
        title: 'Market Research Report.docx',
        page: 7,
        line: 12,
        content: 'Total addressable market estimated at $50B globally with 8% CAGR',
        timestamp: null,
        relevance: 82,
        insight: 'market_size'
      },
      {
        id: 4,
        type: 'document',
        title: 'P&L_Analysis.xlsx',
        page: null,
        line: null,
        content: 'EBITDA margin improved to 18.5% in Q4 2023, up from 16.2% in Q4 2022',
        timestamp: null,
        relevance: 93,
        insight: 'profitability_trend'
      },
      {
        id: 5,
        type: 'audio',
        title: 'CFO_Financial_Review.mp3',
        page: null,
        line: null,
        content: 'Our customer acquisition cost has decreased by 25% while lifetime value increased by 30%...',
        timestamp: '00:08:45',
        relevance: 86,
        insight: 'unit_economics'
      },
      {
        id: 6,
        type: 'document',
        title: 'Customer_Analysis.csv',
        page: null,
        line: null,
        content: 'Top 10 customers represent 45% of total revenue, with average contract value of $180K',
        timestamp: null,
        relevance: 91,
        insight: 'customer_concentration'
      }
    ]
    
    setEvidenceItems(mockEvidence)
  }

  const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'sources', label: 'Sources', count: evidenceItems.length },
    { id: 'insights', label: 'AI Insights', count: 8 },
    { id: 'related', label: 'Related', count: 5 },
    { id: 'comments', label: 'Comments', count: 3 }
  ]

  const aiInsights = [
    {
      id: 1,
      type: 'trend',
      title: 'Revenue Growth Acceleration',
      confidence: 94,
      description: 'Revenue growth rate is accelerating, increasing from 12% to 15% YoY',
      sources: ['Financial Statements 2023.pdf', 'P&L_Analysis.xlsx'],
      impact: 'positive'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Customer Concentration Risk',
      confidence: 87,
      description: 'High dependency on top customers creates revenue risk',
      sources: ['Customer_Analysis.csv'],
      impact: 'negative'
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Market Expansion Potential',
      confidence: 82,
      description: 'Significant opportunity in European markets based on management commentary',
      sources: ['Management Interview - CEO', 'Market Research Report.docx'],
      impact: 'positive'
    },
    {
      id: 4,
      type: 'metric',
      title: 'Improving Unit Economics',
      confidence: 91,
      description: 'Customer acquisition efficiency improving significantly',
      sources: ['CFO_Financial_Review.mp3'],
      impact: 'positive'
    }
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

        {activeTab === 'insights' && (
          <div className="insights-list">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Analyzing evidence...</p>
              </div>
            ) : (
              aiInsights.map((insight) => (
                <div key={insight.id} className="insight-item">
                  <div className="insight-header">
                    <div className="insight-icon">
                      {insight.type === 'trend' && <BarChart3 size={14} />}
                      {insight.type === 'risk' && <AlertTriangle size={14} />}
                      {insight.type === 'opportunity' && <Target size={14} />}
                      {insight.type === 'metric' && <Zap size={14} />}
                    </div>
                    <div className="insight-confidence">
                      {insight.confidence}%
                    </div>
                  </div>
                  
                  <div className="insight-body">
                    <h4 className={`insight-title impact-${insight.impact}`}>
                      {insight.title}
                    </h4>
                    <p className="insight-description">
                      {insight.description}
                    </p>
                    
                    <div className="insight-sources">
                      <span className="sources-label">Sources:</span>
                      {insight.sources.map((source, i) => (
                        <span key={i} className="source-tag">
                          <FileText size={10} />
                          {source.split('.')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
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
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 0.5rem;
        }
        
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-top: 2px solid var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .insights-list {
          padding: 0.5rem;
        }
        
        .insight-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        
        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background-color: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
        }
        
        .insight-icon {
          color: var(--text-secondary);
        }
        
        .insight-confidence {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
        }
        
        .insight-body {
          padding: 0.75rem;
        }
        
        .insight-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .insight-title.impact-positive {
          color: var(--success);
        }
        
        .insight-title.impact-negative {
          color: var(--error);
        }
        
        .insight-title.impact-neutral {
          color: var(--text-primary);
        }
        
        .insight-description {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        
        .insight-sources {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          align-items: center;
        }
        
        .sources-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-right: 0.25rem;
        }
        
        .source-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: var(--bg-secondary);
          color: var(--text-muted);
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          font-size: 0.6875rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default EvidencePanel
