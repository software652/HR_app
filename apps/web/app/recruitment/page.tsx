import { api } from '../../lib/api'
export default async function Recruitment() {
  const rows = await api<any[]>('/jobs')
  return <><h1>Recruitment</h1><table><thead><tr><th>ID</th><th>Title</th><th>Department</th><th>Applicants</th><th>Status</th></tr></thead><tbody>{rows.map(j => <tr key={j.id}><td>{j.id}</td><td>{j.title}</td><td>{j.department}</td><td>{j.applicants}</td><td><span className="badge">{j.status}</span></td></tr>)}</tbody></table></>
}
