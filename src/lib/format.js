/* Presentational helpers shared by cards, badges and queues.

   `formatDuration` renders a plain seconds value as a clock string (1:23,
   1:02:03); `formatPublishedAt` turns an ISO timestamp into a friendly date
   ("12 Jun 2020" style); `videoMetaText` stitches together the small line
   shown under each video title. */

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  if (minutes > 0) {
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }
  return `0:${String(secs).padStart(2, '0')}`
}

export function formatPublishedAt(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function videoMetaText(video) {
  const published = formatPublishedAt(video && video.publishedAt)
  const duration = formatDuration(video && video.duration)
  return [published, duration].filter(Boolean).join(' · ')
}
