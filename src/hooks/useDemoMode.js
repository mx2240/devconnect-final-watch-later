import { useCallback, useEffect, useState } from 'react'

/* The four storyable states plus the default. Order matters for the demo
   control strip, not for behaviour. */
const MODES = ['normal', 'loading', 'error', 'empty']

function readModeFromUrl() {
  try {
    const value = new URLSearchParams(window.location.search).get('demo')
    if (MODES.includes(value)) return value
  } catch {
    /* ignore malformed input */
  }
  return 'normal'
}

/* Central demo-mode state. The mode is kept in sync with the URL via
   history.replaceState so each state has a stable, shareable URL
   (e.g. ?demo=loading), and the back/forward buttons stay in sync through
   the popstate listener. */
export function useDemoMode() {
  const [mode, setMode] = useState(readModeFromUrl)

  useEffect(() => {
    const onPop = () => setMode(readModeFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const changeMode = useCallback((next) => {
    const target = MODES.includes(next) ? next : 'normal'
    setMode(target)
    try {
      const url = new URL(window.location.href)
      if (target === 'normal') url.searchParams.delete('demo')
      else url.searchParams.set('demo', target)
      window.history.replaceState({}, '', url)
    } catch {
      /* URL updates are best-effort; the in-memory mode is authoritative */
    }
  }, [])

  return { demoMode: mode, setDemoMode: changeMode, modes: MODES }
}
