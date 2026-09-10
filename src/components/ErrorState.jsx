export default function ErrorState({ title, message, children }) {
  return (
    <div className="state state-error" role="alert">
      <div className="state-mark" aria-hidden="true">!</div>
      <h2>{title}</h2>
      <p>{message}</p>
      <p>Check your connection and try again. If the live source is unavailable, the normal app can fall back to a bundled catalog.</p>
      {children ? <div className="button-group">{children}</div> : null}
    </div>
  )
}
