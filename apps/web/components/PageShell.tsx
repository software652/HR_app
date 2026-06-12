import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

export default function PageShell({ title, children }: Props) {
  return (
    <>
      <h1 className="page-title">{title}</h1>
      {children}
    </>
  )
}
