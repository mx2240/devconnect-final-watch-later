/* Local persistence for the Watch Later queue.

   The queue is kept in localStorage under a fixed key as an array of JSON
   records. Every read/write is guarded: if storage is blocked, disabled,
   full, or simply absent, the app degrades to an in-memory queue instead of
   throwing. The API mirrors the object shape used by the video feed. */

export const STORAGE_KEY = 'watch-later:v1'

const ALLOWED_KEYS = [
  'id',
  'title',
  'description',
  'thumbnail',
  'channel',
  'publishedAt',
  'duration',
  'url',
]

export function isStorageUsable() {
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
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null
  const record = { id: String(entry.id || '') }
  if (!record.id) return null
  for (const key of ALLOWED_KEYS) {
    if (key === 'id') continue
    if (entry[key] !== undefined) record[key] = entry[key]
  }
  return record
}

export function loadSavedVideos() {
  if (!isStorageUsable()) return []
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
  return parsed
    .map(normalizeStored)
    .filter(Boolean)
    .filter((video) => {
      if (seen.has(video.id)) return false
      seen.add(video.id)
      return true
    })
}

export function saveSavedVideos(videos) {
  if (!isStorageUsable()) return false
  const clean = Array.isArray(videos)
    ? videos.map(normalizeStored).filter(Boolean)
    : []
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
    return true
  } catch {
    return false
  }
}

export function addSavedVideo(video, current = loadSavedVideos()) {
  const record = normalizeStored(video)
  if (!record || current.some((entry) => entry.id === record.id)) return current
  const next = [record, ...current]
  saveSavedVideos(next)
  return next
}

export function removeSavedVideo(id, current = loadSavedVideos()) {
  const next = current.filter((entry) => entry.id !== id)
  saveSavedVideos(next)
  return next
}
