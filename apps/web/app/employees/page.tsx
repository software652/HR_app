import { api } from '../../lib/api'
export default async function Employees() {
  const rows = await api<any[]>('/employees')
  return <><h1>Employees</h1><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Status</th></tr></thead><tbody>{rows.map(e => <tr key={e.id}><td>{e.id}</td><td>{e.name}</td><td>{e.email}</td><td>{e.department}</td><td>{e.role}</td><td><span className="badge">{e.status}</span></td></tr>)}</tbody></table></>
}
