export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <p className="loading-message">Loading videos for discovery...</p>
      <ul className="skeleton-grid" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <li className="skeleton-card" key={index}>
            <div className="skeleton skeleton--media" />
            <div className="skeleton-lines">
              <div className="skeleton skeleton--line skeleton--wide" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
