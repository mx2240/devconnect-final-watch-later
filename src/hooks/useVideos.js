import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDiscoveryVideos } from '../lib/api.js'
import { FALLBACK_VIDEOS } from '../data/fallbackVideos.js'

export const DEFAULT_LIMIT = 24

function initialVideosFor(mode) {
  if (mode === 'error' || mode === 'empty') return []
  return FALLBACK_VIDEOS.slice(0, 6)
}

/* Discovery-feed lifecycle.
   - normal  : try the live Commons feed; on any failure fall back to the
               bundbundled catalog and expose `isFallback: true`.
   - loading : hold a loading state; resolve to the bundled catalog after a
               short pause so the skeleton is actually visible.
   - error   : simulate a failure on purpose (demo).
   - empty   : treat success as "no results" (demo). */

export function useVideos(limit = DEFAULT_LIMIT) {
  const [status, setStatus] = useState('loading')
  const [videos, setVideos] = useState(() => initialVideosFor('normal'))
  const [errorMessage, setErrorMessage] = useState('')
  const [isFallback, setIsFallback] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [demoMode])

  const get = useCallback(
    async function getFeed() {
      setStatus('loading')
      setErrorMessage('')
      setIsFallback(false)

      if (demoMode === 'error') {
        await sleep(650)
        if (!mounted.current) return
        setStatus('error')
        setErrorMessage(
          'The live feed is unavailable right now — here is what an unreachable feed looks like.',
        )
        return
      }
      if (demoMode === 'empty') {
        await sleep(650)
        if (!mounted.current) return
        setStatus('success')
        setVideos([])
        setIsFallback(true)
        return
      }
      if (demoMode === 'loading') {
        await sleep(1400)
        if (!mounted.current) return
        setStatus('success')
        setVideos(FALLBACK_VIDEOS.slice(0, 8))
        setIsFallback(true)
        return
      }

      try {
        const remote = await fetchDiscoveryVideos(limit)
        if (!mounted.current) return
        setVideos(remote)
        setStatus('success')
        setIsFallback(false)
      } catch (error) {
        if (!mounted.current) return
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
    get()
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
