/* Presentational helpers shared across cards, chips, and the queue. */

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
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/* Short "meta strip" for a browse card: published date + play length. */
export function videoMetaText(video) {
  const date = formatPublishedAt(video && video.publishedAt)
  const duration = formatDuration(video && video.duration)
  return [date, duration].filter(Boolean).join(' · ')
}
