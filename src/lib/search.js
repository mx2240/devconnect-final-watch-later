/* Case-insensitive discovery search. A video matches when the query shows up
   in its title, channel or description; tokens are trimmed so stray spaces
   never produce a false “no results” state. */

export function searchVideos(videos, query) {
  const needle = String(query || '').trim().toLowerCase()
  if (!needle) return videos
  return videos.filter((video) =>
    [video.title, video.channel, video.description]
      .some((field) => String(field || '').toLowerCase().includes(needle)),
  )
}
