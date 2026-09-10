/* Data access layer for the Wikimedia Commons video catalog.

   The live feed is fetched from Commons' MediaWiki API (keyless + CORS):
     - generator=search over namespace 6 (File) with `filetype:video`
     - prop=videoinfo returns the direct file URL and a JPEG thumbnail

   Every network/parse failure surfaces as an ApiError, which the UI reacts to
   by swapping in the bundled sample catalog. */

const COMMONS_URL = 'https://commons.wikimedia.org/w/api.php'
const FILE_PATH_BASE = 'https://commons.wikimedia.org/wiki/Special:FilePath'

export class ApiError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ApiError'
  }
}

export function buildFeedUrl() {
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

function thumbnailFromTitle(title) {
  const fileBase = String(title || '').replace(/^File:/, '')
  if (!fileBase) return ''
  return `${FILE_PATH_BASE}/${encodeURIComponent(fileBase)}?width=480`
}

function normalizeVideo(page) {
  const info = page && page.videoinfo && page.videoinfo[0]
  const title = page && page.title ? String(page.title).replace(/^File:/, '') : ''
  const id = page && page.pageid ? String(page.pageid) : `page-${title || 'unknown'}`
  const infoThumb = info && info.thumburl ? info.thumburl : ''
  const thumbnail =
    infoThumb || (page && page.title ? thumbnailFromTitle(page.title) : '')
  const duration = info && Number.isFinite(info.duration) ? Math.round(info.duration) : 0
  return {
    id,
    title: title || 'Untitled archival video',
    description: `Archival footage from Wikimedia Commons${
      info && info.user ? ` — uploaded by ${info.user}` : ''
    }.`,
    thumbnail,
    channel: (info && info.user) || 'Wikimedia Commons',
    publishedAt:
      info && info.timestamp ? new Date(info.timestamp).toISOString() : '',
    duration,
    url: (info && info.url) || '',
  }
}

/* Fetch up to gsrlimit videos from the live Commons feed.
   Resolves to a normalized array; throws ApiError on any failure. */
export function fetchDiscoveryVideos() {
  return fetchFeedRecords().then((records) => records.map(normalizeVideo))
}

async function fetchFeedRecords() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  let response
  try {
    response = await fetch(buildFeedUrl(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error && error.name === 'AbortError') {
      throw new ApiError('The video feed timed out.', { cause: error })
    }
    throw new ApiError('Could not reach the video feed. Please check your connection.', {
      cause: error,
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    throw new ApiError(`The video feed replied with status ${response.status}.`)
  }

  let payload
  try {
    payload = await response.json()
  } catch (error) {
    throw new ApiError('The video feed returned unreadable data.', { cause: error })
  }

  const pages = payload && payload.query && payload.query.pages
  if (!pages || typeof pages !== 'object' || !Object.keys(pages).length) {
    throw new ApiError('The video feed returned no pages.')
  }
  return Object.values(pages)
}
