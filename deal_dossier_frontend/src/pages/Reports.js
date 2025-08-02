import React, { useState } from 'react'
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download,
  Share,
  Filter
} from 'lucide-react'

// PUBLIC_INTERFACE
const Reports = () => {
  /**
   * Reports page component displaying financial and analysis reports
   * @returns {JSX.Element} Reports page component
   */
  const [activeSection, setActiveSection] = useState('executive-summary')

  const reportSections = [
    { id: 'executive-summary', label: 'Executive Summary', icon: FileText },
    { id: 'financial-analysis', label: 'Financial Analysis', icon: DollarSign },
    { id: 'market-analysis', label: 'Market Analysis', icon: TrendingUp },
    { id: 'operations', label: 'Operations', icon: Users },
  ]

  const keyMetrics = [
    { label: 'Revenue (2023)', value: '$2.4M', change: '+15%', trend: 'up' },
    { label: 'EBITDA Margin', value: '18.5%', change: '+2.3%', trend: 'up' },
    { label: 'Market Size', value: '$50B', change: '+8%', trend: 'up' },
    { label: 'Team Size', value: '45', change: '+12', trend: 'up' },
  ]

  const chartData = {
    revenue: [
      { period: '2020', value: 1.2 },
      { period: '2021', value: 1.8 },
      { period: '2022', value: 2.1 },
      { period: '2023', value: 2.4 },
      { period: '2024E', value: 3.2 },
    ]
  }

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold">Reports</h1>
          <p className="text-secondary">TechCorp Acquisition Analysis</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Filter size={16} />
            Filter
          </button>
          <button className="btn btn-secondary">
            <Share size={16} />
            Share
          </button>
          <button className="btn btn-accent">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {keyMetrics.map((metric) => (
          <div key={metric.label} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <div className={`metric-trend trend-${metric.trend}`}>
                <TrendingUp size={14} />
                {metric.change}
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
          </div>
        ))}
      </div>

      <div className="reports-layout">
        {/* Report Navigation */}
        <div className="report-nav">
          <h3 className="nav-title">Report Sections</h3>
          <div className="nav-sections">
            {reportSections.map((section) => (
              <button
                key={section.id}
                className={`nav-section ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="report-content">
          {activeSection === 'executive-summary' && (
            <ExecutiveSummary chartData={chartData} />
          )}
          {activeSection === 'financial-analysis' && (
            <FinancialAnalysis />
          )}
          {activeSection === 'market-analysis' && (
            <MarketAnalysis />
          )}
          {activeSection === 'operations' && (
            <Operations />
          )}
        </div>
      </div>

      <style jsx>{`
        .reports-page {
          padding: 0;
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
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .metric-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .trend-up {
          color: var(--success);
        }
        
        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .reports-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }
        
        .report-nav {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          height: fit-content;
        }
        
        .nav-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .nav-sections {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .nav-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: var(--radius);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        
        .nav-section:hover,
        .nav-section.active {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        
        .nav-section.active {
          background-color: var(--accent);
          color: white;
        }
        
        .report-content {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          min-height: 600px;
        }
        
        @media (max-width: 1024px) {
          .reports-layout {
            grid-template-columns: 1fr;
          }
          
          .report-nav {
            order: 2;
          }
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
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

// Component for Executive Summary section
const ExecutiveSummary = ({ chartData }) => (
  <div className="section-content">
    <div className="section-header">
      <h2>Executive Summary</h2>
      <p className="section-description">
        High-level overview of TechCorp's financial performance and strategic position
      </p>
    </div>

    <div className="content-grid">
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Revenue Growth</h3>
          <div className="chart-actions">
            <button className="btn btn-sm btn-secondary">View Details</button>
          </div>
        </div>
        <div className="chart-placeholder">
          <BarChart3 size={48} />
          <p>Revenue Chart</p>
          <div className="chart-data">
            {chartData.revenue.map((item) => (
              <div key={item.period} className="data-point">
                <span className="period">{item.period}</span>
                <span className="value">${item.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insights-panel">
        <h3>Key Insights</h3>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-icon success">
              <TrendingUp size={16} />
            </div>
            <div className="insight-content">
              <h4>Strong Revenue Growth</h4>
              <p>15% YoY growth with accelerating momentum</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon success">
              <DollarSign size={16} />
            </div>
            <div className="insight-content">
              <h4>Healthy Margins</h4>
              <p>EBITDA margin improved to 18.5%</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon warning">
              <Users size={16} />
            </div>
            <div className="insight-content">
              <h4>Team Expansion</h4>
              <p>Rapid hiring may impact short-term margins</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style jsx>{`
      .section-content {
        padding: 2rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .section-description {
        color: var(--text-secondary);
      }
      
      .content-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
      }
      
      .chart-container {
        border: 1px solid var(--border);
        border-radius: var(--radius);
        overflow: hidden;
      }
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background-color: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
      }
      
      .chart-title {
        font-size: 1.125rem;
        font-weight: 600;
      }
      
      .chart-placeholder {
        padding: 3rem;
        text-align: center;
        color: var(--text-muted);
      }
      
      .chart-placeholder p {
        margin: 1rem 0 2rem;
        font-size: 1.125rem;
      }
      
      .chart-data {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .data-point {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }
      
      .period {
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
      
      .value {
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .insights-panel {
        background-color: var(--bg-secondary);
        border-radius: var(--radius);
        padding: 1.5rem;
      }
      
      .insights-panel h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .insights-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .insight-item {
        display: flex;
        gap: 1rem;
      }
      
      .insight-icon {
        width: 32px;
        height: 32px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .insight-icon.success {
        background-color: rgb(16 185 129 / 0.1);
        color: var(--success);
      }
      
      .insight-icon.warning {
        background-color: rgb(245 158 11 / 0.1);
        color: var(--warning);
      }
      
      .insight-content h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .insight-content p {
        font-size: 0.8125rem;
        color: var(--text-secondary);
      }
      
      @media (max-width: 768px) {
        .content-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  </div>
)

// Placeholder components for other sections
const FinancialAnalysis = () => (
  <div className="section-content">
    <div className="section-header">
      <h2>Financial Analysis</h2>
      <p>Detailed financial performance and projections</p>
    </div>
    <div className="placeholder-content">
      <DollarSign size={48} />
      <p>Financial analysis charts and tables will be displayed here</p>
    </div>
    <style jsx>{`
      .section-content {
        padding: 2rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .placeholder-content {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-muted);
      }
      
      .placeholder-content p {
        margin-top: 1rem;
        font-size: 1.125rem;
      }
    `}</style>
  </div>
)

const MarketAnalysis = () => (
  <div className="section-content">
    <div className="section-header">
      <h2>Market Analysis</h2>
      <p>Market size, competition, and growth opportunities</p>
    </div>
    <div className="placeholder-content">
      <TrendingUp size={48} />
      <p>Market analysis data and visualizations will be displayed here</p>
    </div>
    <style jsx>{`
      .section-content {
        padding: 2rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .placeholder-content {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-muted);
      }
      
      .placeholder-content p {
        margin-top: 1rem;
        font-size: 1.125rem;
      }
    `}</style>
  </div>
)

const Operations = () => (
  <div className="section-content">
    <div className="section-header">
      <h2>Operations</h2>
      <p>Operational metrics and team structure</p>
    </div>
    <div className="placeholder-content">
      <Users size={48} />
      <p>Operational data and organizational charts will be displayed here</p>
    </div>
    <style jsx>{`
      .section-content {
        padding: 2rem;
      }
      
      .section-header {
        margin-bottom: 2rem;
      }
      
      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .placeholder-content {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-muted);
      }
      
      .placeholder-content p {
        margin-top: 1rem;
        font-size: 1.125rem;
      }
    `}</style>
  </div>
)

export default Reports
