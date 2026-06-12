import { api } from '../../lib/api'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import type { Job } from '../../lib/types'

export default async function RecruitmentPage() {
  let rows: Job[] = []
  let error: string | null = null

  try {
    rows = await api<Job[]>('/jobs')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load job listings'
  }

  if (error) return <ErrorMessage title="Recruitment unavailable" message={error} />

  const openCount = rows.filter(j => j.status === 'Open').length

  return (
    <>
      <h1 className="page-title">Recruitment</h1>
      {rows.length > 0 && (
        <div className="summary-bar">
          <strong>{openCount}</strong> open position{openCount !== 1 ? 's' : ''}
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Department</th><th>Applicants</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="empty-row">No job listings found</td></tr>
            )}
            {rows.map(j => (
              <tr key={j.id}>
                <td><code>{j.id}</code></td>
                <td>{j.title}</td>
                <td>{j.department}</td>
                <td>{j.applicants}</td>
                <td><StatusBadge status={j.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
