/* Watch Later queue state + localStorage persistence in one hook.

   Saved entries survive a refresh. Each video id can appear only once,
   and save/remove actions update the persisted queue immediately.
*/

import { useCallback, useMemo, useState } from 'react'
import {
  loadSavedVideos,
  saveSavedVideos,
  addSavedVideo,
} from '../lib/storage.js'

export function useWatchLater() {
  const [videos, setVideos] = useState(() => loadSavedVideos())

  const ids = useMemo(() => videos.map((video) => video.id), [videos])

  const toggle = useCallback((video) => {
    setVideos((current) => {
      const exists = current.some((entry) => entry.id === video.id)
      if (exists) {
        const next = current.filter((entry) => entry.id !== video.id)
        saveSavedVideos(next)
        return next
      }
      const next = addSavedVideo(video, current)
      saveSavedVideos(next)
      return next
    })
  }, [])

  const remove = useCallback((id) => {
    setVideos((current) => {
      const next = current.filter((entry) => entry.id !== id)
      saveSavedVideos(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setVideos([])
    saveSavedVideos([])
  }, [])

  const isSaved = useCallback(
    (id) => ids.includes(id),
    [ids],
  )

  const count = videos.length

  return { videos, ids, count, isSaved, toggle, remove, clear }
}
