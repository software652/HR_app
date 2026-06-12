import { api } from '../lib/api'

export default async function Dashboard() {
  const data = await api<{ totalEmployees:number; activeEmployees:number; pendingLeaves:number; openJobs:number }>('/dashboard')
  return <>
    <h1>HR Dashboard</h1>
    <div className="grid">
      <div className="card"><h3>Total Employees</h3><h1>{data.totalEmployees}</h1></div>
      <div className="card"><h3>Active Employees</h3><h1>{data.activeEmployees}</h1></div>
      <div className="card"><h3>Pending Leaves</h3><h1>{data.pendingLeaves}</h1></div>
      <div className="card"><h3>Open Jobs</h3><h1>{data.openJobs}</h1></div>
    </div>
  </>
}
