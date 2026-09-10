/* One card in the discovery grid: thumbnail with a duration badge, the play
   link, the meta line, a description clampholer, and a single toggle button
   that adds/removes the video from Watch Later.

   The button carries aria-pressed (so the state is obvious to AT users) and
   calls back with a human sentence to announce via the app's live region. */

import { useEffect } from 'react'
import { formatDuration, formatPublishedAt, videoMetaText } from '../lib/format.js'
import { ThumbIcon } from './icons.jsx'

export default function VideoCard({ video, isSaved, onToggleSave, onSaveAnnounce }) {
  const meta = videoMetaText(video)

  function handleClick() {
    onToggleSave(video)
    onSaveAnnounce(
      isSaved
        ? `Removed "${video.title}" from Watch Later.`
        : `Added "${video.title}" to Watch Later.`,
    )
  }

  return (
    <article className="video-card" aria-labelledby={`video-title-${video.id}`}>
      <div className="video-card__media">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt="" loading="lazy" decode="async" />
        ) : (
          <span className="video-card__placeholder" aria-hidden="true">
            <ThumbIcon />
          </span>
        )}
        {video.duration > 0 ? (
          <span className="video-card__duration" aria-label={`${video.duration} seconds`}>
            {formatDuration(video.duration)}
          </span>
        ) : null}
        {isSaved ? (
          <span className="video-card__saved-snack" role="img" aria-label="Saved">
            ✓
          </span>
        ) : null}
      </div>

      <div className="video-card__body">
        <h3 id={`video-title-${video.id}`} className="video-card__title">
          <a href={video.url || '#'} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </h3>
        <p className="video-card__meta">{meta}</p>
        <p className="video-card__description">{video.description}</p>

        <button
          type="button"
          className={`save-btn${isSaved ? ' save-btn--on' : ''}`}
          aria-pressed={isSaved}
          onClick={handleClick}
        >
          {isSaved ? 'Remove from Watch Later' : 'Add to Watch Later'}
        </button>
      </div>
    </article>
  )
}
