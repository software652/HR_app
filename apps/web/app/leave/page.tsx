import { api } from '../../lib/api'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import type { Leave } from '../../lib/types'

export default async function LeavePage() {
  let rows: Leave[] = []
  let error: string | null = null

  try {
    rows = await api<Leave[]>('/leaves')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load leave records'
  }

  if (error) return <ErrorMessage title="Leave Management unavailable" message={error} />

  return (
    <>
      <h1 className="page-title">Leave Management</h1>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Employee</th><th>Type</th>
              <th>From</th><th>To</th><th>Reason</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty-row">No leave records found</td></tr>
            )}
            {rows.map(l => (
              <tr key={l.id}>
                <td><code>{l.id}</code></td>
                <td>{l.employee}</td>
                <td>{l.type}</td>
                <td>{l.from}</td>
                <td>{l.to}</td>
                <td>{l.reason ?? '—'}</td>
                <td><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
