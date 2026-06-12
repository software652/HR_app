interface Props {
  title?: string
  message: string
}

export default function ErrorMessage({ title = 'Something went wrong', message }: Props) {
  return (
    <div className="error-box" role="alert">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  )
}
