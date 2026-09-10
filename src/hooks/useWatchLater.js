/* The Watch Later queue as a React hook. Backed by localStorage (see
   src/lib/storage.js) so the queue survives a refresh; every mutation re-persists
   the full list and returns the updated snapshot. */

import { useCallback, useEffect, useState } from 'react'
import { loadSavedVideos, saveSavedVideos } from '../lib/storage.js'
import { STORAGE_KEY } from '../lib/storage.js'

export function useWatchLater() {
  const [videos, setVideos] = useState(() => loadSavedVideos())

  /* Keep the view and the persisted copy in lockstep. Persistence failures are
     silent here — the queue still works for the session. */
  useEffect(() => {
    saveSavedVideos(videos)
  }, [videos])

  const toggle = useCallback(
    (video) => {
      setVideos((current) => {
        const isSaved = current.some((entry) => entry.id === video.id)
        if (isSaved) return current.filter((entry) => entry.id !== video.id)
        return [video, ...current]
      })
    },
    [],
  )

  const remove = useCallback((videoId) => {
    setVideos((current) => current.filter((entry) => entry.id !== videoId))
  }, [])

  const clear = useCallback(() => setVideos([]), [])

  const isSaved = useCallback(
    (videoId) => videos.some((video) => video.id === videoId),
    [videos],
  )

  return { videos, toggle, remove, clear, isSaved, count: videos.length }
}
