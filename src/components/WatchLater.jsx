import { useRef } from 'react'
import { videoMetaText } from '../lib/format.js'
import { TrashIcon } from './icons.jsx'
import EmptyState from './EmptyState.jsx'

export default function WatchLater({ videos, onRemove, onSaveAnnounce, isDemoEmpty }) {
  const headingRef = useRef(null)
  const removeRefs = useRef([])

  function removeVideo(video, index) {
    onRemove(video.id)
    onSaveAnnounce(`Removed "${video.title}" from Watch Later.`)

    window.requestAnimationFrame(() => {
      const buttons = removeRefs.current.filter(Boolean)
      const nextButton = buttons[index] || buttons[index - 1]

      if (nextButton) {
        nextButton.focus()
      } else {
        headingRef.current?.focus()
      }
    })
  }

  return (
    <section className="watch-later" id="watch-later" aria-labelledby="watch-later-title">
      <div className="section-head">
        <div>
          <h2 id="watch-later-title" tabIndex="-1" ref={headingRef}>Watch Later</h2>
          <p className="section-note">
            {videos.length} saved {videos.length === 1 ? 'video' : 'videos'} ready for later viewing.
            {isDemoEmpty ? ' Empty demo mode is active; your saved localStorage list has not been deleted.' : ''}
          </p>
        </div>
        <a className="section-action" href="#discovery">Browse videos</a>
      </div>

      {videos.length ? (
        <ul className="watch-later__list" aria-label="Saved Watch Later videos">
          {videos.map((video, index) => (
            <li className="watch-later__item" key={video.id}>
              {video.thumbnail ? (
                <img className="watch-later__thumb" src={video.thumbnail} alt={`Thumbnail for ${video.title}`} loading="lazy" />
              ) : (
                <span className="watch-later__thumb watch-later__thumb--empty" aria-hidden="true" />
              )}
              <div className="watch-later__info">
                <h3><a href={video.url || '#'} target="_blank" rel="noopener noreferrer">{video.title}</a></h3>
                <p>{video.channel}</p>
                <p>{videoMetaText(video)}</p>
              </div>
              <button
                type="button"
                className="watch-later__remove"
                aria-label={`Remove ${video.title} from Watch Later`}
                ref={(node) => {
                  removeRefs.current[index] = node
                }}
                onClick={() => removeVideo(video, index)}
              >
                <TrashIcon />
                <span>Remove</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Your Watch Later list is empty"
          message="Watch Later is for videos you want to save before opening or finishing them. Use Add to Watch Later on any discovery card, then return here when you are ready to watch."
        >
          <a className="btn btn-primary" href="#discovery">Browse videos</a>
        </EmptyState>
      )}
    </section>
  )
}
