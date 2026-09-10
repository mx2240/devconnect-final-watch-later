export default function EmptyState({ title, message, children }) {
  return (
    <div className="state state-empty">
      <div className="state-mark" aria-hidden="true">+</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {children ? <div className="button-group">{children}</div> : null}
    </div>
  )
}
