export default function SettingsPage() {
  return (
    <>
      <h1 className="page-title">Settings</h1>
      <div className="card placeholder-card">
        <h3>General Settings</h3>
        <dl className="settings-list">
          <dt>API URL</dt>
          <dd><code>{process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}</code></dd>
          <dt>Demo credentials</dt>
          <dd><code>hr@company.com</code> / <code>password123</code></dd>
          <dt>Environment</dt>
          <dd><code>{process.env.NODE_ENV}</code></dd>
        </dl>
      </div>
    </>
  )
}
