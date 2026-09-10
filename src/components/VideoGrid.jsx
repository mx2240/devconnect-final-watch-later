import VideoCard from './VideoCard.jsx'

export default function VideoGrid({ videos, savedIds, onToggleSave, onSaveAnnounce }) {
  if (!videos.length) {
    return (
      <div className="state state-quiet">
        <h2>No matching videos</h2>
        <p>Try a different title, channel, or description. Saved videos are kept in Watch Later while you search.</p>
      </div>
    )
  }

  return (
    <ul className="video-grid" aria-label="Discovery videos">
      {videos.map((video) => (
        <li key={video.id}>
          <VideoCard
            video={video}
            isSaved={savedIds.includes(video.id)}
            onToggleSave={onToggleSave}
            onSaveAnnounce={onSaveAnnounce}
          />
        </li>
      ))}
    </ul>
  )
}
