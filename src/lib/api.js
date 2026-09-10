/* Data layer for the Wikimedia Commons video feed.

   We talk to Commons' MediaWiki API keylessly (CORS is open for
   commons.wikimedia.org with `origin=*`), search over namespace File
   (6) using `filetype:video`, then ask prop=videoinfo to enrich each
   result with the direct file URL and a JPEG thumbnail.

   Every request goes through one function: fetchDiscoveryVideos(). On any
   failure it throws an ApiError with a human-readable message, which the UI
   treats as "fall back to the bundled sample catalog". */

export const COMMONS_BASE = 'https://commons.wikimedia.org/w/api.php'
export const FILE_PATH_BASE =
  'https://commons.wikimedia.org/wiki/Special:FilePath'

export class ApiError extends Error {
  constructor(message, options) {
    super(message, options)
    this.name = 'ApiError'
  }
}

function buildFeedUrl(limit = 30) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: 'filetype:video',
    gsrnamespace: '6',
    gsrlimit: String(limit),
    prop: 'videoinfo',
    viprop: 'url|size|mime|user|timestamp',
  })
  return `${COMMONS_BASE}?${params.toString()}`
}

function titleFromPage(page) {
  return page && page.title ? String(page.title).replace(/^File:/, '') : ''
}

function thumbnailForTitle(title) {
  if (!title) return ''
  return `${FILE_PATH_BASE}/${encodeURIComponent(title)}?width=480`
}

function normalizeVideo(page) {
  const info = page && page.videoinfo && page.videoinfo[0]
  const title = titleFromPage(page)
  const id = page && page.pageid ? String(page.pageid) : `page-${title || 'unknown'}`
  const rawThumb = (info && info.thumburl) || ''
  let thumbnail = rawThumb
  if (!thumbnail && title) thumbnail = thumbnailForTitle(title)
  if (thumbnail && thumbnail.startsWith('//')) thumbnail = `https:${thumbnail}`

  const durationMs = info && Number.isFinite(info.duration) ? info.duration : 0
  const durationSeconds = Math.round(durationMs / 1000)

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
    duration: durationSeconds,
    url: (info && info.url) || '',
  }
}

/* Fetch a batch of archival videos. Resolves to a normalized array, or
   rejects with an ApiError when the feed is unreachable / returns junk. */
export async function fetchDiscoveryVideos(limit = 30) {
  let response
  try {
    response = await fetch(buildFeedUrl(limit), {
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    throw new ApiError('The video feed could not be reached.', { cause: error })
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
  const videos = pages
    ? Object.values(pages)
        .map(normalizeVideo)
        .filter((video) => video.url)
    : []

  if (!videos.length) {
    throw new ApiError('The video feed returned no results.')
  }

  return videos
}
