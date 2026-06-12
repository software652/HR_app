import './globals.css'
import Link from 'next/link'

const nav = ['Dashboard','Employees','Leave','Attendance','Payroll','Recruitment','Performance','Reports','Settings']

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <aside className="sidebar">
      <h2>PeopleHR</h2>
      {nav.map(item => <Link key={item} href={item === 'Dashboard' ? '/' : '/' + item.toLowerCase()}>{item}</Link>)}
    </aside>
    <main className="main">{children}</main>
  </body></html>
}
