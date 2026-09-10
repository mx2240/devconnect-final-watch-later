/* Persistent top bar: brand mark, “Watch Later” count that mirrors the saved
   queue, and a keyboard-friendly skip link to the discovery section. */

export default function Header({ savedCount, onSkip }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a href="#discovery" className="skip-link" onClick={onSkip}>
          Skip to videos
        </a>
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="brand-text">Watch Later</span>
        </div>
        <nav className="header-nav" aria-label="Site">
          <a href="#discovery" className="nav-link">Discover</a>
          <a href="#watch-later" className="nav-link">
            Watch Later
            <span className="nav-count" aria-label={`${savedCount} saved`}>
              {savedCount}
            </span>
          </a>
        </nav>
      </div>
    </header>
  )
}
