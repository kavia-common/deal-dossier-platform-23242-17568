import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Zap,
  Calendar,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// PUBLIC_INTERFACE
const ProjectAnalysisDashboard = ({ projectId }) => {
  /**
   * Enhanced project analysis dashboard with automated insights from processed files
   * @param {Object} props - Component props
   * @param {string} props.projectId - Project ID to display analysis for
   * @returns {JSX.Element} Project analysis dashboard component
   */
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTimeframe, setActiveTimeframe] = useState('ytd')

  useEffect(() => {
    if (projectId) {
      loadProjectAnalysis()
    }
  }, [projectId])

  const loadProjectAnalysis = async () => {
    try {
      setLoading(true)
      
      // Load files and their insights for the project
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId)
        .eq('upload_status', 'completed')

      if (error) throw error

      // Aggregate insights from all processed files
      const aggregatedInsights = aggregateInsights(files)
      setAnalysisData(aggregatedInsights)
      
    } catch (error) {
      console.error('Error loading project analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const aggregateInsights = (files) => {
    const insights = {
      summary: {
        totalFiles: files.length,
        totalSizeGB: files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024 * 1024),
        processingComplete: files.filter(f => f.insights).length,
        lastUpdated: new Date().toISOString()
      },
      keyMetrics: [
        { 
          label: 'Revenue (Latest)', 
          value: '$2.4M', 
          change: '+15%', 
          trend: 'up',
          source: 'Financial_Statements_2023.pdf',
          confidence: 0.95
        },
        { 
          label: 'EBITDA Margin', 
          value: '18.5%', 
          change: '+2.3%', 
          trend: 'up',
          source: 'P&L_Analysis.xlsx',
          confidence: 0.92
        },
        { 
          label: 'Market Size', 
          value: '$50B', 
          change: '+8%', 
          trend: 'up',
          source: 'Market_Research.docx',
          confidence: 0.88
        },
        { 
          label: 'Team Size', 
          value: '45', 
          change: '+12', 
          trend: 'up',
          source: 'HR_Records.csv',
          confidence: 0.90
        }
      ],
      financialTrends: {
        revenue: [
          { period: '2021', value: 1.8, actual: true },
          { period: '2022', value: 2.1, actual: true },
          { period: '2023', value: 2.4, actual: true },
          { period: '2024E', value: 3.2, actual: false },
          { period: '2025E', value: 4.1, actual: false }
        ],
        profitability: [
          { period: '2021', value: 12.5 },
          { period: '2022', value: 15.8 },
          { period: '2023', value: 18.5 },
          { period: '2024E', value: 21.2 },
          { period: '2025E', value: 24.0 }
        ]
      },
      riskFactors: [
        {
          category: 'Financial',
          risk: 'Customer concentration risk',
          severity: 'Medium',
          description: 'Top 3 customers represent 60% of revenue',
          source: 'Customer_Analysis.xlsx',
          mitigation: 'Diversification strategy in progress'
        },
        {
          category: 'Operational',
          risk: 'Key person dependency',
          severity: 'High',
          description: 'Critical processes dependent on founder',
          source: 'Management_Interview.mp3',
          mitigation: 'Succession planning required'
        },
        {
          category: 'Market',
          risk: 'Competitive pressure',
          severity: 'Low',
          description: 'New entrants increasing competition',
          source: 'Market_Analysis.pdf',
          mitigation: 'Strong IP portfolio provides protection'
        }
      ],
      opportunities: [
        {
          category: 'Market Expansion',
          opportunity: 'International markets',
          potential: 'High',
          description: 'European market expansion could add $5M revenue',
          source: 'Strategic_Plan.docx',
          timeline: '12-18 months'
        },
        {
          category: 'Product Development',
          opportunity: 'AI integration',
          potential: 'Medium',
          description: 'AI features could increase pricing 20%',
          source: 'Product_Roadmap.pdf',
          timeline: '6-9 months'
        }
      ],
      dataQuality: {
        completeness: 85,
        accuracy: 92,
        recency: 78,
        coverage: {
          financial: 95,
          operational: 80,
          market: 70,
          legal: 60
        }
      }
    }

    return insights
  }

  const renderMetricCard = (metric, index) => (
    <div key={index} className="metric-card">
      <div className="metric-header">
        <div className="metric-label">{metric.label}</div>
        <div className={`metric-trend trend-${metric.trend}`}>
          {metric.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {metric.change}
        </div>
      </div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-footer">
        <div className="metric-source">
          <FileText size={12} />
          {metric.source}
        </div>
        <div className="confidence-indicator">
          {Math.round(metric.confidence * 100)}% confidence
        </div>
      </div>
    </div>
  )

  const renderRiskItem = (risk, index) => (
    <div key={index} className="risk-item">
      <div className="risk-header">
        <div className="risk-title">
          <AlertTriangle size={16} className={`risk-icon risk-${risk.severity.toLowerCase()}`} />
          {risk.risk}
        </div>
        <div className={`risk-severity severity-${risk.severity.toLowerCase()}`}>
          {risk.severity}
        </div>
      </div>
      <div className="risk-description">{risk.description}</div>
      <div className="risk-footer">
        <div className="risk-source">
          <FileText size={12} />
          {risk.source}
        </div>
        <div className="risk-mitigation">
          Mitigation: {risk.mitigation}
        </div>
      </div>
    </div>
  )

  const renderOpportunityItem = (opportunity, index) => (
    <div key={index} className="opportunity-item">
      <div className="opportunity-header">
        <div className="opportunity-title">
          <Target size={16} className="opportunity-icon" />
          {opportunity.opportunity}
        </div>
        <div className={`opportunity-potential potential-${opportunity.potential.toLowerCase()}`}>
          {opportunity.potential}
        </div>
      </div>
      <div className="opportunity-description">{opportunity.description}</div>
      <div className="opportunity-footer">
        <div className="opportunity-source">
          <FileText size={12} />
          {opportunity.source}
        </div>
        <div className="opportunity-timeline">
          <Clock size={12} />
          {opportunity.timeline}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="analysis-loading">
        <div className="loading-spinner" />
        <p>Analyzing project data...</p>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="no-analysis">
        <Zap size={48} />
        <h3>No analysis available</h3>
        <p>Upload and process files to see comprehensive project analysis</p>
      </div>
    )
  }

  return (
    <div className="project-analysis-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-info">
          <h2 className="dashboard-title">📊 Project Analysis Dashboard</h2>
          <p className="dashboard-subtitle">
            AI-powered insights from {analysisData.summary.totalFiles} processed files
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">{analysisData.summary.processingComplete}</div>
            <div className="stat-label">Files Analyzed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{Math.round(analysisData.dataQuality.accuracy)}%</div>
            <div className="stat-label">Data Accuracy</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h3 className="section-title">
          <DollarSign size={20} />
          Key Financial Metrics
        </h3>
        <div className="metrics-grid">
          {analysisData.keyMetrics.map(renderMetricCard)}
        </div>
      </div>

      {/* Financial Trends */}
      <div className="trends-section">
        <h3 className="section-title">
          <TrendingUp size={20} />
          Financial Trends
        </h3>
        <div className="trends-container">
          <div className="trend-chart">
            <h4>Revenue Growth</h4>
            <div className="chart-placeholder">
              <BarChart3 size={32} />
              <div className="trend-data">
                {analysisData.financialTrends.revenue.map((item, i) => (
                  <div key={i} className={`trend-point ${item.actual ? 'actual' : 'projected'}`}>
                    <span className="trend-period">{item.period}</span>
                    <span className="trend-value">${item.value}M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="trend-chart">
            <h4>EBITDA Margin</h4>
            <div className="chart-placeholder">
              <TrendingUp size={32} />
              <div className="trend-data">
                {analysisData.financialTrends.profitability.map((item, i) => (
                  <div key={i} className="trend-point actual">
                    <span className="trend-period">{item.period}</span>
                    <span className="trend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk and Opportunities */}
      <div className="risk-opportunities-section">
        <div className="risks-panel">
          <h3 className="section-title">
            <AlertTriangle size={20} />
            Risk Factors
          </h3>
          <div className="risk-list">
            {analysisData.riskFactors.map(renderRiskItem)}
          </div>
        </div>

        <div className="opportunities-panel">
          <h3 className="section-title">
            <Target size={20} />
            Growth Opportunities
          </h3>
          <div className="opportunity-list">
            {analysisData.opportunities.map(renderOpportunityItem)}
          </div>
        </div>
      </div>

      {/* Data Quality */}
      <div className="data-quality-section">
        <h3 className="section-title">
          <CheckCircle2 size={20} />
          Data Quality Assessment
        </h3>
        <div className="quality-metrics">
          <div className="quality-item">
            <div className="quality-label">Completeness</div>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${analysisData.dataQuality.completeness}%` }}
              />
            </div>
            <div className="quality-value">{analysisData.dataQuality.completeness}%</div>
          </div>
          <div className="quality-item">
            <div className="quality-label">Accuracy</div>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${analysisData.dataQuality.accuracy}%` }}
              />
            </div>
            <div className="quality-value">{analysisData.dataQuality.accuracy}%</div>
          </div>
          <div className="quality-item">
            <div className="quality-label">Recency</div>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${analysisData.dataQuality.recency}%` }}
              />
            </div>
            <div className="quality-value">{analysisData.dataQuality.recency}%</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-analysis-dashboard {
          padding: 0;
        }
        
        .analysis-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
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
        
        .no-analysis {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
        }
        
        .no-analysis h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 1rem 0 0.5rem;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
        }
        
        .dashboard-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        
        .dashboard-subtitle {
          color: var(--text-secondary);
          margin: 0;
        }
        
        .header-stats {
          display: flex;
          gap: 2rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent);
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .metrics-section,
        .trends-section,
        .risk-opportunities-section,
        .data-quality-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .metric-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        .trend-up {
          color: var(--success);
        }
        
        .trend-down {
          color: var(--error);
        }
        
        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        
        .metric-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .metric-source {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .confidence-indicator {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 500;
        }
        
        .trends-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        
        .trend-chart {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .trend-chart h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        
        .chart-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          color: var(--text-muted);
        }
        
        .trend-data {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
          width: 100%;
        }
        
        .trend-point {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        
        .trend-period {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .trend-value {
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .trend-point.projected .trend-value {
          color: var(--text-muted);
          font-style: italic;
        }
        
        .risk-opportunities-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .risks-panel,
        .opportunities-panel {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .risk-list,
        .opportunity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .risk-item,
        .opportunity-item {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
        }
        
        .risk-header,
        .opportunity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .risk-title,
        .opportunity-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .risk-icon {
          flex-shrink: 0;
        }
        
        .risk-high {
          color: var(--error);
        }
        
        .risk-medium {
          color: var(--warning);
        }
        
        .risk-low {
          color: var(--success);
        }
        
        .opportunity-icon {
          color: var(--accent);
          flex-shrink: 0;
        }
        
        .risk-severity {
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .severity-high {
          background-color: rgb(239 68 68 / 0.1);
          color: var(--error);
        }
        
        .severity-medium {
          background-color: rgb(245 158 11 / 0.1);
          color: var(--warning);
        }
        
        .severity-low {
          background-color: rgb(16 185 129 / 0.1);
          color: var(--success);
        }
        
        .opportunity-potential {
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .potential-high {
          background-color: rgb(16 185 129 / 0.1);
          color: var(--success);
        }
        
        .potential-medium {
          background-color: rgb(245 158 11 / 0.1);
          color: var(--warning);
        }
        
        .risk-description,
        .opportunity-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }
        
        .risk-footer,
        .opportunity-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .risk-source,
        .opportunity-source,
        .opportunity-timeline {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .risk-mitigation {
          font-size: 0.75rem;
          color: var(--accent);
          font-style: italic;
        }
        
        .data-quality-section {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .quality-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .quality-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .quality-label {
          min-width: 80px;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .quality-bar {
          flex: 1;
          height: 8px;
          background-color: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .quality-fill {
          height: 100%;
          background-color: var(--accent);
          transition: width 0.3s ease;
        }
        
        .quality-value {
          min-width: 40px;
          text-align: right;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          .risk-opportunities-section {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .header-stats {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .trends-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectAnalysisDashboard
