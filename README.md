# Later

A focused DevConnect frontend final project rebuilding one YouTube feature: Watch Later / Saved Videos.

Original: YouTube

Rebuilt feature: Watch Later / Saved Videos

## Why This Feature

Watch Later is a small but important product feature: users need to discover videos, save them quickly, understand what is already saved, and trust that the saved list survives refreshes. It is a good scope for demonstrating async data loading, persistence, failure states, responsive UI, and keyboard accessibility without rebuilding the full YouTube platform.



## Architecture

Later is a React/Vite frontend organized around reusable components, application hooks, data, and utility modules.

### Main structure

* `src/components/` — reusable interface components such as the header, video cards, Watch Later list, loading state, error state, and empty state.
* `src/hooks/` — application behavior including video loading, demo modes, and Watch Later state management.
* `src/data/` — bundled fallback video catalog used when the external data source is unavailable.
* `src/lib/` — API and browser-storage utilities.
* `App.jsx` — connects the main application features and state.

### Data flow

Video discovery follows this path:

`Wikimedia Commons API → api.js → useVideos → App → VideoGrid`

Saved videos follow this path:

`User action → useWatchLater → storage.js → localStorage`

The saved-video data uses the versioned storage key `watch-later:v1`.

When the external API is unavailable, the application can use the bundled fallback catalog. Reviewer-controlled demo modes make the loading, error, empty, and normal states directly reproducible.

### Key documentation

* `README.md` — explains how to install, run, test, and understand the project.
* `DECISIONS.md` — records the three major technical decisions, alternatives considered, reasons for choosing them, and their trade-offs.


## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Data Source

The discovery feed uses the public Wikimedia Commons MediaWiki API with no API key:

`https://commons.wikimedia.org/w/api.php`

The app requests video files from Commons and normalizes them into this compact shape:

```js
{
  id,
  title,
  description,
  thumbnail,
  channel,
  publishedAt,
  duration,
  url,
}
```

If the live API is unavailable, blocked, returns a non-2xx response, returns invalid JSON, or returns no usable videos, the normal app falls back to a bundled local catalog of real Wikimedia Commons video URLs. This keeps the feature demonstrable while still exercising realistic asynchronous fetching.

## Persistence

Saved videos are stored in `localStorage` under the namespaced key `watch-later:v1`.

Only compact normalized video objects are stored. The app handles malformed stored data, duplicate ids, and unavailable `localStorage` gracefully. If storage is unavailable, the saved list still works in memory for the current page session instead of crashing.

## Application States

Loading state: The discovery area displays a visible loading message and skeleton cards with `role="status"`.

Error state: The app displays a clear error panel with `role="alert"`, explains that videos could not be fetched, and provides a working Try again button.

Empty state: Watch Later explains what the list is for, how saving works, and provides a Browse videos action.

Populated state: Saved videos show thumbnail, title, channel metadata, open links, remove controls, and a useful saved count.

## Reviewer Demo URLs

Use these URLs without editing source code:

| State | URL | Behavior |
| ----- | --- | -------- |
| Normal | `/` | Fetches the live feed, falls back if needed, and uses actual saved localStorage data. |
| Loading | `/?demo=loading` | Keeps the loading state visible for inspection. |
| Error | `/?demo=error` | Shows the simulated fetch error. Try again reruns the simulated failure. |
| Empty | `/?demo=empty` | Shows an empty Watch Later state without deleting existing saved localStorage data. Discovery still loads normally. |

When a demo mode is active, the Demo states control can switch between Normal, Loading, Error, and Empty.

## Keyboard Testing

1. Press Tab from the top of the page and verify the Skip to videos link appears.
2. Use Tab and Shift+Tab to move through navigation, search, video links, save buttons, Watch Later links, remove buttons, and demo controls.
3. Press Enter or Space on Add to Watch Later and Remove from Watch Later buttons.
4. Confirm visible focus styles are present on every interactive control.
5. Remove a saved item from Watch Later and confirm focus moves to the next remove button or back to the Watch Later heading.
6. Confirm save/remove announcements are available through the polite live region.

## Responsive Testing

Test at desktop, tablet, mobile, 375px, and 320px widths.

At 320px, verify that cards fit the viewport, long titles wrap, search remains usable, buttons remain tappable, demo controls wrap, and Watch Later items remain readable without horizontal scrolling.

## Project Structure

```text
src/
  components/
    DemoStateControls.jsx
    EmptyState.jsx
    ErrorState.jsx
    Header.jsx
    LoadingState.jsx
    SearchBar.jsx
    VideoCard.jsx
    VideoGrid.jsx
    WatchLater.jsx
    icons.jsx
  data/
    fallbackVideos.js
  hooks/
    useDemoMode.js
    useVideos.js
    useWatchLater.js
  lib/
    api.js
    format.js
    search.js
    storage.js
  App.css
  App.jsx
  index.css
  main.jsx
```

## Comparison with YouTube

| Area                  | YouTube | This project |
| --------------------- | ------- | ------------ |
| Watch Later           | Yes     | Yes          |
| Save/remove videos    | Yes     | Yes          |
| Persistent saved list | Yes     | Yes          |
| Search                | Yes     | Yes          |
| Full accounts         | Yes     | No           |
| Comments              | Yes     | No           |
| Uploading             | Yes     | No           |
| Subscriptions         | Yes     | No           |
| Live streaming        | Yes     | No           |

This project intentionally rebuilds one feature rather than reproducing the entire YouTube product.

## Not Implemented

- Accounts/authentication
- Video uploading
- Comments
- Likes/dislikes
- Subscriptions
- Live streaming
- Shorts
- Creator tools
- Notifications
- Full recommendation system
- YouTube's complete platform

Reason:

The project intentionally focuses on the Watch Later feature rather than reproducing the entire YouTube product. These omitted areas are outside the selected feature and would reduce the depth and polish possible within the project scope.

## Improvement Over The Original

This implementation places stronger emphasis on keyboard accessibility and explicit loading, error and empty states, making the feature easier to operate and understand when data is loading, unavailable or when no videos have been saved.

This is a scope-specific improvement for this rebuilt feature, not a claim about the full YouTube platform.




