const OPTIONS = [
  ['normal', 'Normal'],
  ['loading', 'Loading'],
  ['error', 'Error'],
  ['empty', 'Empty'],
]

export default function DemoStateControls({ mode, onChange, isFallback, savedCount }) {
  return (
    <section className="demo-strip" aria-labelledby="demo-states-title">
      <div>
        <h2 id="demo-states-title">Demo states</h2>
        <p>
          Current mode: <strong>{mode}</strong>. Saved count: <strong>{savedCount}</strong>.
          {isFallback ? ' Using the bundled fallback catalog.' : ' Using the live feed when available.'}
        </p>
      </div>
      <div className="demo-strip__buttons" role="group" aria-label="Switch reviewer demo state">
        {OPTIONS.map(([value, label]) => (
          <button
            type="button"
            key={value}
            className="demo-strip__button"
            aria-pressed={mode === value}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
