import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Eye
} from 'lucide-react'
import ProjectAnalysisDashboard from '../components/Analysis/ProjectAnalysisDashboard'

// PUBLIC_INTERFACE
const Dashboard = () => {
  /**
   * Main dashboard page showing key metrics, recent activity, and quick actions
   * @returns {JSX.Element} Dashboard component
   */
  const [stats, setStats] = useState({
    totalProjects: 0,
    filesProcessed: 0,
    reportsGenerated: 0,
    pendingTasks: 0,
    insightsGenerated: 0,
    processingAccuracy: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [currentProject, setCurrentProject] = useState('project-1')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load stats (mock data for now)
      setStats({
        totalProjects: 12,
        filesProcessed: 248,
        reportsGenerated: 36,
        pendingTasks: 8,
        insightsGenerated: 156,
        processingAccuracy: 94
      })

      // Load recent activity (mock data for now)
      setRecentActivity([
        {
          id: 1,
          type: 'file_processed',
          title: 'Financial_Statements_2023.pdf processed with AI insights',
          project: 'TechCorp Acquisition',
          timestamp: '1 hour ago',
          status: 'completed',
          details: 'Extracted 15 key metrics, 94% confidence'
        },
        {
          id: 2,
          type: 'insight_generated',
          title: 'Revenue growth trend identified',
          project: 'TechCorp Acquisition',
          timestamp: '2 hours ago',
          status: 'completed',
          details: '15% YoY growth acceleration detected'
        },
        {
          id: 3,
          type: 'file_uploaded',
          title: 'Management_Interview.mp3 uploaded and transcribed',
          project: 'RetailCo Analysis',
          timestamp: '3 hours ago',
          status: 'completed',
          details: '45 min interview, 3 speakers identified'
        },
        {
          id: 4,
          type: 'report_generated',
          title: 'Executive Summary auto-generated',
          project: 'RetailCo Analysis',
          timestamp: '4 hours ago',
          status: 'completed',
          details: 'Based on 8 processed documents'
        },
        {
          id: 5,
          type: 'risk_identified',
          title: 'Customer concentration risk flagged',
          project: 'StartupX Due Diligence',
          timestamp: '6 hours ago',
          status: 'warning',
          details: 'Top 3 customers = 60% revenue'
        },
        {
          id: 6,
          type: 'task_assigned',
          title: 'Review market analysis section',
          project: 'TechCorp Acquisition',
          timestamp: '8 hours ago',
          status: 'pending'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FileText,
      color: 'primary',
      change: '+2 this month'
    },
    {
      title: 'Files Processed',
      value: stats.filesProcessed,
      icon: Upload,
      color: 'success',
      change: '+15 this week'
    },
    {
      title: 'Reports Generated',
      value: stats.reportsGenerated,
      icon: BarChart3,
      color: 'info',
      change: '+5 this week'
    },
    {
      title: 'AI Insights',
      value: stats.insightsGenerated,
      icon: Zap,
      color: 'accent',
      change: '+28 this week'
    },
    {
      title: 'Processing Accuracy',
      value: `${stats.processingAccuracy}%`,
      icon: CheckCircle2,
      color: 'success',
      change: '+2% this month'
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: Clock,
      color: 'warning',
      change: '3 overdue'
    }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'file_uploaded':
        return <Upload size={16} />
      case 'file_processed':
        return <Zap size={16} />
      case 'insight_generated':
        return <TrendingUp size={16} />
      case 'report_generated':
        return <FileText size={16} />
      case 'risk_identified':
        return <AlertCircle size={16} />
      case 'task_assigned':
        return <Clock size={16} />
      case 'comment_added':
        return <Users size={16} />
      default:
        return <AlertCircle size={16} />
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={14} className="text-success" />
      case 'pending':
        return <Clock size={14} className="text-warning" />
      case 'warning':
        return <AlertCircle size={14} className="text-warning" />
      case 'error':
        return <AlertCircle size={14} className="text-error" />
      default:
        return <AlertCircle size={14} className="text-info" />
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-secondary">Welcome back! Here's what's happening with your deals.</p>
        </div>
        <div className="dashboard-actions">
          <button 
            className={`btn ${showAnalysis ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            <Eye size={16} />
            {showAnalysis ? 'Show Overview' : 'AI Analysis'}
          </button>
          <button className="btn btn-primary">
            <Upload size={16} />
            Upload Files
          </button>
          <button className="btn btn-accent">
            <FileText size={16} />
            New Project
          </button>
        </div>
      </div>

      {!showAnalysis ? (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            {statCards.map((stat) => (
              <div key={stat.title} className="stat-card">
                <div className="stat-card-header">
                  <div className={`stat-icon stat-icon-${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="stat-change">
                    <TrendingUp size={12} />
                    {stat.change}
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-title">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="content-grid">
        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <button className="btn btn-secondary btn-sm">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4 className="activity-title">{activity.title}</h4>
                    <span className="activity-timestamp">{activity.timestamp}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-project">{activity.project}</span>
                    <div className="activity-status">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                  {activity.details && (
                    <div className="activity-details">
                      {activity.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <Upload size={24} />
              <span>Upload Files</span>
            </button>
            <button className="quick-action-btn">
              <FileText size={24} />
              <span>Create Report</span>
            </button>
            <button className="quick-action-btn">
              <BarChart3 size={24} />
              <span>View Analytics</span>
            </button>
            <button className="quick-action-btn">
              <Users size={24} />
              <span>Manage Team</span>
            </button>
          </div>
        </div>
        </>
      ) : (
        <div className="analysis-view">
          <ProjectAnalysisDashboard projectId={currentProject} />
        </div>
      )}

      <style jsx>{`
        .dashboard {
          padding: 0;
        }
        
        .dashboard-loading {
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .dashboard-actions {
          display: flex;
          gap: 1rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        
        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .stat-icon-primary { background-color: var(--primary); }
        .stat-icon-success { background-color: var(--success); }
        .stat-icon-info { background-color: var(--info); }
        .stat-icon-warning { background-color: var(--warning); }
        .stat-icon-accent { background-color: var(--accent); }
        
        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--success);
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        
        .stat-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        .dashboard-section {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .activity-list {
          padding: 0;
        }
        
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-light);
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background-color: var(--bg-tertiary);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        
        .activity-content {
          flex: 1;
          min-width: 0;
        }
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }
        
        .activity-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .activity-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        
        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .activity-project {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .activity-details {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          font-style: italic;
        }
        
        .analysis-view {
          margin-top: 1rem;
        }
        
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          padding: 1.5rem;
        }
        
        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 1rem;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .quick-action-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          transform: translateY(-2px);
        }
        
        .quick-action-btn span {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .dashboard-actions {
            justify-content: center;
          }
        }
        
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard
