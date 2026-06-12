import { api } from '../../lib/api'
export default async function Payroll() {
  const rows = await api<any[]>('/payroll')
  return <><h1>Payroll</h1><table><thead><tr><th>ID</th><th>Employee</th><th>Month</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Status</th></tr></thead><tbody>{rows.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.employee}</td><td>{p.month}</td><td>₹{p.gross}</td><td>₹{p.deductions}</td><td>₹{p.net}</td><td><span className="badge">{p.status}</span></td></tr>)}</tbody></table></>
}
