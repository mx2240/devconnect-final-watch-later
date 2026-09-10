import { useCallback, useEffect, useState } from 'react'
import { fetchDiscoveryVideos } from '../lib/api.js'
import { FALLBACK_VIDEOS } from '../data/fallbackVideos.js'

export const DEFAULT_LIMIT = 24

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/* Discovery-feed lifecycle.
   - normal  : try the live Commons feed; on any failure fall back to the
                bundled catalog and expose `isFallback: true`.
    - loading : hold a loading state so reviewers can inspect the skeletons.
    - error   : simulate a failure on purpose (demo).
    - empty   : fetch normally; App applies the empty Watch Later view only. */

export function useVideos({ demoMode = 'normal', limit = DEFAULT_LIMIT } = {}) {
  const [status, setStatus] = useState('loading')
  const [videos, setVideos] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const get = useCallback(
    async function getFeed(signal) {
      setStatus('loading')
      setErrorMessage('')
      setIsFallback(false)

      if (demoMode === 'loading') return

      if (demoMode === 'error') {
        await sleep(650)
        if (signal.aborted) return
        setStatus('error')
        setErrorMessage(
          'Something went wrong while fetching videos. Check your connection and try again.',
        )
        return
      }

      try {
        const remote = await fetchDiscoveryVideos(limit, { signal })
        if (signal.aborted) return
        setVideos(remote)
        setStatus('success')
        setIsFallback(false)
      } catch (error) {
        if (signal.aborted) return
        setIsFallback(true)
        setVideos(FALLBACK_VIDEOS.slice(0, 8))
        setStatus('success')
        setErrorMessage(
          `The live feed is unreachable${error && error.name === 'ApiError' ? ` — ${error.message}` : ''}. Showing the bundled sample catalog instead.`,
        )
      }
    },
    [demoMode, limit],
  )

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => get(controller.signal), 0)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [get, attempt])

  const retry = useCallback(() => {
    setAttempt((current) => current + 1)
  }, [])

  return {
    status,
    videos,
    errorMessage,
    isFallback,
    retry,
  }
}
