import { api } from '../../lib/api'
export default async function Leave() {
  const rows = await api<any[]>('/leaves')
  return <><h1>Leave Management</h1><table><thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead><tbody>{rows.map(l => <tr key={l.id}><td>{l.id}</td><td>{l.employee}</td><td>{l.type}</td><td>{l.from}</td><td>{l.to}</td><td><span className="badge">{l.status}</span></td></tr>)}</tbody></table></>
}
