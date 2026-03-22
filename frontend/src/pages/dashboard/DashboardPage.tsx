import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getDashboard } from '../../api/dashboard'
import './DashboardPage.css'

interface ActivityChartItem {
  month: string
  count: number
}

interface ActivityItem {
  id: number
  title: string
  date: string
  status: string
}

interface DashboardData {
  clients_count: number
  activities_count: number
  activities_completed_this_month: number
  activities_pending: number
  activity_chart: ActivityChartItem[]
  upcoming_activities: ActivityItem[]
  recent_activities: ActivityItem[]
}

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pending',
  in_progress: 'In progress',
  done:        'Done',
}

const STATUS_CLASS: Record<string, string> = {
  pending:     'badge badge-pending',
  in_progress: 'badge badge-progress',
  done:        'badge badge-done',
}

const DONUT_COLORS = ['#2da866', '#c47f0a']

function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('Error loading dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!data) return null

  const donutData = [
    { name: 'Completed', value: data.activities_completed_this_month },
    { name: 'Pending',   value: data.activities_pending },
  ]

  return (
    <div className="page">

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Clients</span>
          <span className="stat-value">{data.clients_count}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total activities</span>
          <span className="stat-value">{data.activities_count}</span>
        </div>
        <div className="stat-card stat-card--success">
          <span className="stat-label">Completed this month</span>
          <span className="stat-value">{data.activities_completed_this_month}</span>
        </div>
        <div className="stat-card stat-card--warning">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{data.activities_pending}</span>
        </div>
      </div>

      <div className="dashboard-charts">

        <div className="chart-card">
          <h2 className="section-title">Completed activities (last 6 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.activity_chart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-2)' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-2)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
                cursor={{ fill: 'var(--bg-hover)' }}
              />
              <Bar dataKey="count" fill="var(--blue)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="section-title">Completed vs Pending</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((_, index) => (
                  <Cell key={index} fill={DONUT_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {data.upcoming_activities.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Upcoming activities</h2>
          <ul className="activity-list">
            {data.upcoming_activities.map(activity => (
              <li
                key={activity.id}
                className="activity-item"
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <span className="activity-title">{activity.title}</span>
                <div className="activity-meta">
                  <span className="activity-date">{activity.date.split('T')[0]}</span>
                  <span className={STATUS_CLASS[activity.status] ?? 'badge'}>
                    {STATUS_LABEL[activity.status] ?? activity.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {data.recent_activities.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Recent activities</h2>
          <ul className="activity-list">
            {data.recent_activities.map(activity => (
              <li
                key={activity.id}
                className="activity-item"
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <span className="activity-title">{activity.title}</span>
                <div className="activity-meta">
                  <span className="activity-date">{activity.date.split('T')[0]}</span>
                  <span className={STATUS_CLASS[activity.status] ?? 'badge'}>
                    {STATUS_LABEL[activity.status] ?? activity.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  )
}

export default DashboardPage