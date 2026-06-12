interface Props {
  status: string
}

const colorMap: Record<string, string> = {
  Active:    'badge badge--green',
  Approved:  'badge badge--green',
  Open:      'badge badge--green',
  Processed: 'badge badge--green',
  Pending:   'badge badge--yellow',
  Draft:     'badge badge--yellow',
  'On Leave':'badge badge--yellow',
  Inactive:  'badge badge--gray',
  Rejected:  'badge badge--red',
  Closed:    'badge badge--gray',
  Failed:    'badge badge--red',
}

export default function StatusBadge({ status }: Props) {
  const cls = colorMap[status] ?? 'badge'
  return <span className={cls}>{status}</span>
}
