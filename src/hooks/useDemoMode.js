import { useCallback, useEffect, useState } from 'react'

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
   (e.g. ?demo=loading). */
export function useDemoMode() {
  const [mode, setMode] = useState(readModeFromUrl)

  useEffect(() => {
    const onPop = () => setMode(readModeFromUrl())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const changeMode = useCallback((next) => {
    const mode = MODES.includes(next) ? next : 'normal'
    setMode(mode)
    try {
      const url = new URL(window.location.href)
      if (mode === 'normal') url.searchParams.delete('demo')
      else url.searchParams.set('demo', mode)
      window.history.replaceState({}, '', url)
    } catch {
      /* URL update is best-effort */
    }
  }, [])

  return { demoMode: mode, setDemoMode: changeMode, modes: MODES }
}
