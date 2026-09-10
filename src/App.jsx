import { useCallback, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import VideoGrid from './components/VideoGrid.jsx'
import WatchLater from './components/WatchLater.jsx'
import EmptyState from './components/EmptyState.jsx'
import LoadingState from './components/LoadingState.jsx'
import ErrorState from './components/ErrorState.jsx'
import DemoStateControls from './components/DemoStateControls.jsx'
import { useVideos } from './hooks/useVideos.js'
import { useWatchLater } from './hooks/useWatchLater.js'
import { useDemoMode } from './hooks/useDemoMode.js'
import { searchVideos } from './lib/search.js'
import { videoMetaText } from './lib/format.js'

/* App wires the three feature areas together:
     1. Discovery  — a live feed from Wikimedia Commons with search + states
     2. Watch Later — a persistent queue (localStorage) with focus management
     3. Demo toolbar — reach every UI state (normal/loading/error/empty) with
        a stable, shareable URL via ?demo=… */

export default function App() {
  const { demoMode, setDemoMode } = useDemoMode()
  const { status, videos, errorMessage, isFallback, retry } = useVideos({
    demoMode,
    limit: 24,
  })
  const watchLater = useWatchLater()

  const [query, setQuery] = useState('')

  const visibleVideos = useMemo(
    () => (query.trim() ? searchVideos(videos, query) : videos),
    [videos, query],
  )

  const handleToggleSave = useCallback(
    (video) => watchLater.toggle(video),
    [watchLater],
  )

  const handleAnnounce = useCallback(
    (message) => {
      const node = document.getElementById('app-live-region')
      if (node) node.textContent = message
    },
    [],
  )

  return (
    <div className="app-shell">
      <Header savedCount={watchLater.videos.length} />

      <main className="app-body" id="main">
        <section className="discovery" aria-labelledby="discovery-title">
          <div className="discovery-head">
            <h1 id="discovery-title">Video discovery</h1>
            <p className="discovery-note">
              What are you in the mood to watch later? Save anything you like,
              and pick it up again from your Watch Later queue — on any device.
            </p>
          </div>

          <DemoStateControls
            mode={demoMode}
            onChange={setDemoMode}
            isFallback={isFallback}
            savedCount={watchLater.videos.length}
          />

          {status === 'success' ? (
            <SearchBar value={query} onChange={setQuery} videos={visibleVideos} />
          ) : null}

          {status === 'empty' ? (
            <EmptyState
              title="Nothing to watch yet"
              message="There are no videos to show right now. Try the demo toolbar to see different states, or check your connection and load the feed again."
            />
          ) : null}

          {status === 'loading' ? <LoadingState /> : null}

          {status === 'error' ? (
            <ErrorState
              title="Could not load the feed"
              message={errorMessage || 'Something went wrong while loading the feed.'}
            >
              <button type="button" className="btn btn-primary" onClick={retry}>
                Try again
              </button>
            </ErrorState>
          ) : null}

          {status === 'success' ? (
            <VideoGrid
              videos={visibleVideos}
              savedIds={watchLater.ids}
              onToggleSave={handleToggleSave}
              onSaveAnnounce={handleAnnounce}
            />
          ) : null}
        </section>

        <WatchLater
          videos={watchLater.videos}
          onRemove={watchLater.remove}
          onSaveAnnounce={handleAnnounce}
        />
      </main>

      <footer className="site-footer">
        <p>
          Watch Later — a focused rebuild of YouTube&apos;s “Watch Later”
          feature. Part of the DevConnect final project.
        </p>
      </footer>

      <div
        id="app-live-region"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  )
}
