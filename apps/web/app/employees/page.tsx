import { api } from '../../lib/api'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import type { Employee } from '../../lib/types'

export default async function Employees() {
  let rows: Employee[] = []
  let error: string | null = null

  try {
    rows = await api<Employee[]>('/employees')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load employees'
  }

  if (error) return <ErrorMessage title="Employees unavailable" message={error} />

  return (
    <>
      <h1 className="page-title">Employees</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th>
              <th>Department</th><th>Role</th><th>Joined</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty-row">No employees found</td></tr>
            )}
            {rows.map(e => (
              <tr key={e.id}>
                <td><code>{e.id}</code></td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>{e.role}</td>
                <td>{e.joiningDate}</td>
                <td><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
