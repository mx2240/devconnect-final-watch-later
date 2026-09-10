import { FALLBACK_VIDEOS } from '../data/fallbackVideos.js'

export const COMMONS_URL = 'https://commons.wikimedia.org/w/api.php'

export class ApiError extends Error {
  constructor(message, { cause } = {}) {
    super(message)
    this.name = 'ApiError'
    this.cause = cause
  }
}

function buildQuery() {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: 'filetype:video',
    gsrnamespace: '6',
    gsrlimit: '24',
    prop: 'videoinfo',
    viprop: 'url|size|mime|user|timestamp',
  })
  return `${COMMONS_URL}?${params.toString()}`
}

function toSeconds(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 0
  return Math.round(ms / 1000)
}

function toIso(epoch) {
  if (!Number.isFinite(epoch) || epoch <= 0) return ''
  try {
    return new Date(epoch).toISOString()
  } catch {
    return ''
  }
}

function normalizePage(page) {
  const info = page.videoinfo && page.videoinfo[0]
  if (!info) return null
  const title = (page.title || 'Untitled video').replace(/^File:/, '')
  return {
    id: page.pageid ? String(page.pageid) : title,
    title,
    description: `A video from Wikimedia Commons shared under a free licence (uploaded by ${info.user || 'an anonymous contributor'}).`,
    channel: info.user || 'Wikimedia Commons',
    publishedAt: info.timestamp || '',
    thumbnail: info.thumburl || '',
    duration: toSeconds(info.duration),
    url: info.url || '',
  }
}

/* Fetch a live sample of videos from Wikimedia Commons (keyless, CORS-enabled).
   Resolves to a normalized array of video records. Throws ApiError on any
   failure so the caller can fall back to the bundled catalog. */
export async function fetchDiscoveryVideos() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(buildQuery(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new ApiError(`The Commons feed replied with status ${response.status}.`)
    }
    const payload = await response.json()
    const pages = payload && payload.query && payload.query.pages
    if (!pages || typeof pages !== 'object') {
      throw new ApiError('The Commons feed returned an unexpected payload.')
    }
    const items = Object.values(pages)
      .map(normalizePage)
      .filter((video) => video && video.url && video.thumbnail)
      .filter(
        (video, index, all) =>
          all.findIndex((other) => other.id === video.id) === index,
      )
    if (items.length === 0) {
      throw new ApiError('The Commons feed returned no videos this time.')
    }
    return items
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error && error.name === 'AbortError') {
      throw new ApiError('The Commons feed took too long to respond.', { cause: error })
    }
    throw new ApiError('Could not reach the Wikimedia Commons feed.', { cause: error })
  } finally {
    clearTimeout(timeout)
  }
}

/* The bundled sample set. Used when the live feed is unreachable or when an
   error is simulated, so the interface always has something to show. */
export function getFallbackVideos() {
  return FALLBACK_VIDEOS.map((video) => ({ ...video }))
}

export const IS_LIVE_FEED_POSSIBLE =
  typeof window !== 'undefined' && 'fetch' in window
