import { api } from '../lib/api'
import ErrorMessage from '../components/ErrorMessage'
import type { DashboardStats } from '../lib/types'

export default async function Dashboard() {
  let data: DashboardStats | null = null
  let error: string | null = null

  try {
    data = await api<DashboardStats>('/dashboard')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load dashboard'
  }

  if (error) return <ErrorMessage title="Dashboard unavailable" message={error} />

  const stats = [
    { label: 'Total Employees',        value: data!.totalEmployees },
    { label: 'Active Employees',       value: data!.activeEmployees },
    { label: 'Pending Leave Requests', value: data!.pendingLeaves },
    { label: 'Open Positions',         value: data!.openJobs },
    { label: 'Payroll This Month (₹)', value: data!.totalPayrollThisMonth.toLocaleString('en-IN') },
  ]

  return (
    <>
      <h1 className="page-title">HR Dashboard</h1>
      <div className="grid">
        {stats.map(s => (
          <div key={s.label} className="card">
            <p className="card-label">{s.label}</p>
            <p className="card-value">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  )
}
