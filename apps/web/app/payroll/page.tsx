import { api } from '../../lib/api'
import StatusBadge from '../../components/StatusBadge'
import ErrorMessage from '../../components/ErrorMessage'
import type { PayrollRecord } from '../../lib/types'

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

export default async function PayrollPage() {
  let rows: PayrollRecord[] = []
  let error: string | null = null

  try {
    rows = await api<PayrollRecord[]>('/payroll')
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load payroll records'
  }

  if (error) return <ErrorMessage title="Payroll unavailable" message={error} />

  const totalNet = rows.filter(r => r.status === 'Processed').reduce((s, r) => s + r.net, 0)

  return (
    <>
      <h1 className="page-title">Payroll</h1>
      {rows.length > 0 && (
        <div className="summary-bar">
          Total processed this period: <strong>{fmt(totalNet)}</strong>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Employee</th><th>Month</th>
              <th>Gross</th><th>Deductions</th><th>Net Pay</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty-row">No payroll records found</td></tr>
            )}
            {rows.map(p => (
              <tr key={p.id}>
                <td><code>{p.id}</code></td>
                <td>{p.employee}</td>
                <td>{p.month}</td>
                <td>{fmt(p.gross)}</td>
                <td>{fmt(p.deductions)}</td>
                <td><strong>{fmt(p.net)}</strong></td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
