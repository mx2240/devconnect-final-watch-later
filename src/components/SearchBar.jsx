/* Live search over the visible discovery results. Filtering is front-end only
   (title, channel and description), announced to screen readers through the
   live region supplied by the app. */

import { useId } from 'react'

export default function SearchBar({ value, onChange, videos }) {
  const labelId = useId()
  const resultText =
    videos.length === 1 ? '1 video' : `${videos.length} videos`

  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="sr-only" htmlFor={labelId}>
        Search discovery videos
      </label>
      <div className="search-box">
        <svg
          className="search-box__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id={labelId}
          type="search"
          className="search-box__input"
          placeholder="Search titles, channels or descriptions…"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {value ? (
          <button
            type="button"
            className="search-box__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            Clear
          </button>
        ) : null}
      </div>
      <p className="search-count" id="search-status">
        {resultText} {value.trim() ? 'match your search' : 'in the feed'}
      </p>
    </form>
  )
}
