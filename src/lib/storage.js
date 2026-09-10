/* Local persistence for the Watch Later queue.

   The queue is stored as JSON under a single key in localStorage. Every read
   and write is guarded so a blocked or missing storage (private mode, quota,
   disabled cookies) degrades to an in-memory queue instead of crashing. */

const STORAGE_KEY = 'watch-later:v1'
const ALLOWED_FIELDS = [
  'id',
  'title',
  'description',
  'thumbnail',
  'channel',
  'publishedAt',
  'duration',
  'url',
]

export function storageAvailable() {
  try {
    const probe = '__watch_later_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

function normalizeStored(entry) {
  if (!entry || typeof entry !== 'object') return null
  return {
    id: String(entry.id || ''),
    title: String(entry.title || 'Untitled video'),
    description: String(entry.description || ''),
    thumbnail: String(entry.thumbnail || ''),
    channel: String(entry.channel || 'Wikimedia Commons'),
    publishedAt: String(entry.publishedAt || ''),
    duration: Math.max(0, Number(entry.duration) || 0),
    url: String(entry.url || ''),
  }
}

function keepOnlyAllowed(video) {
  if (!video) return null
  const record = {}
  for (const field of ALLOWED_FIELDS) {
    if (video[field] !== undefined) record[field] = video[field]
  }
  return record
}

/* Load the saved queue as a normalized array (deduped, discarded junk removed). */
export function loadSavedVideos() {
  if (!storageAvailable()) return []
  let raw
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return []
  }
  if (!raw) return []

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const seen = new Set()
  const videos = []
  for (const entry of parsed) {
    const video = normalizeStored(keepOnlyAllowed(entry))
    if (!video || !video.id || seen.has(video.id)) continue
    seen.add(video.id)
    videos.push(video)
  }
  return videos
}

/* Persist the queue. Returns true on success, false when storage is unusable. */
export function saveSavedVideos(videos) {
  if (!storageAvailable()) return false
  const clean = Array.isArray(videos)
    ? videos.map(keepOnlyAllowed).filter(Boolean)
    : []
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
    return true
  } catch {
    return false
  }
}

/* Add one video to the front of the queue. Returns the (normalized) id. */
export function addSavedVideo(video, queue = loadSavedVideos()) {
  const record = normalizeStored(keepOnlyAllowed(video))
  if (!record || !record.id) return ''
  const without = queue.filter((entry) => entry.id !== record.id)
  const next = [record, ...without]
  saveSavedVideos(next)
  return record.id
}

/* Remove a video from the queue by id. Returns true if something was removed. */
export function removeSavedVideo(id, queue = loadSavedVideos()) {
  const before = queue.length
  const next = queue.filter((entry) => entry.id !== id)
  saveSavedVideos(next)
  return next.length !== before
}

export default {
  STORAGE_KEY,
  storageAvailable,
  loadSavedVideos,
  saveSavedVideos,
  addSavedVideo,
  removeSavedVideo,
}
