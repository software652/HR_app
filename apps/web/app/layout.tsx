import './globals.css'
import Link from 'next/link'
import ErrorBoundary from '../components/ErrorBoundary'

export const metadata = { title: 'PeopleHR', description: 'HR Management Platform' }

const navItems = [
  { label: 'Dashboard',   href: '/' },
  { label: 'Employees',   href: '/employees' },
  { label: 'Leave',       href: '/leave' },
  { label: 'Attendance',  href: '/attendance' },
  { label: 'Payroll',     href: '/payroll' },
  { label: 'Recruitment', href: '/recruitment' },
  { label: 'Performance', href: '/performance' },
  { label: 'Reports',     href: '/reports' },
  { label: 'Settings',    href: '/settings' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h2>PeopleHR</h2>
          </div>
          <nav>
            {navItems.map(item => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </aside>
        <main className="main">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </body>
    </html>
  )
}
