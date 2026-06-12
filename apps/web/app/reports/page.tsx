import { api } from '../../lib/api'
import ErrorMessage from '../../components/ErrorMessage'
import type { DashboardStats } from '../../lib/types'

export default async function ReportsPage() {
  let stats: DashboardStats | null = null
  let error: string | null = null

  try {
    stats = await api<DashboardStats>('/dashboard')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load report data'
  }

  if (error) return <ErrorMessage title="Reports unavailable" message={error} />

  return (
    <>
      <h1 className="page-title">Reports</h1>
      <div className="grid">
        <div className="card">
          <p className="card-label">Headcount</p>
          <p className="card-value">{stats!.totalEmployees}</p>
          <p className="card-sub">{stats!.activeEmployees} active</p>
        </div>
        <div className="card">
          <p className="card-label">Leave Requests</p>
          <p className="card-value">{stats!.pendingLeaves}</p>
          <p className="card-sub">pending approval</p>
        </div>
        <div className="card">
          <p className="card-label">Open Positions</p>
          <p className="card-value">{stats!.openJobs}</p>
          <p className="card-sub">actively hiring</p>
        </div>
        <div className="card">
          <p className="card-label">Payroll (this period)</p>
          <p className="card-value">₹{stats!.totalPayrollThisMonth.toLocaleString('en-IN')}</p>
          <p className="card-sub">processed</p>
        </div>
      </div>
    </>
  )
}
