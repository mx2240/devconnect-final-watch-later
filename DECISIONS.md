# Decision Record — Later

## Project

**Later** is a focused rebuild of YouTube's Watch Later / Saved Videos feature for the DevConnect final project.

The goal was to rebuild one feature to a standard that can be demonstrated, reviewed, and run locally without attempting to recreate the entire YouTube platform.

---

## Decision 1 — Use Wikimedia Commons as the video data source

### What we decided

We decided to use the **Wikimedia Commons public API** as the live source for the discovery video catalog.

The application normalizes the API response into a small internal video structure containing information such as the video ID, title, description, thumbnail, channel/uploader, date, duration, and URL.

The application also includes a bundled fallback catalog so that the main experience can continue when the external API is unavailable.

### Alternatives considered

We considered:

* Building our own backend and database for the video catalog.
* Using a different public video API.
* Using only a local/static catalog.
* Using Wikimedia Commons directly from the frontend.

### Why we chose it

The project needed a real data source while remaining small enough to complete and demonstrate as a frontend project.

Wikimedia Commons provided publicly accessible media and an API without requiring the project to build and maintain its own backend.

Keeping the API access in a dedicated `api.js` module also means the rest of the application does not depend directly on the API's response format.

### What this costs us

The application depends on an external service that we do not control. The API can be unavailable, slow, changed, or restricted by network conditions.

The fallback catalog reduces the impact, but it also means the fallback experience is not the same as having a fully independent backend.

**This decision has proved slightly awkward:** the requirement to demonstrate a genuine failure state conflicts somewhat with the desire to provide a resilient fallback. In normal operation, an API failure becomes a fallback success state, while the project's explicit demo error mode is used to make the failure state directly reviewable.

---

## Decision 2 — Use localStorage for Watch Later persistence

### What we decided

We decided to store the user's Watch Later list in the browser using `localStorage`.

The saved list uses the versioned key:

`watch-later:v1`

Saved videos are normalized before storage, duplicate IDs are prevented, and malformed stored data is handled without crashing the application.

### Alternatives considered

We considered:

* A backend database with user accounts.
* IndexedDB.
* Keeping the list only in React state.
* Browser `localStorage`.

### Why we chose it

The rebuilt feature needed persistence, but implementing authentication, a backend, and a database would significantly increase the scope.

`localStorage` provides enough persistence for this feature: a user can save videos, refresh the page, and still have the saved list.

It also keeps the project easy for another developer to run locally because there is no database or server configuration required.

### What this costs us

The saved list is tied to the browser rather than a user account.

A user cannot sign in and access the same Watch Later list from another device or browser.

It also means the project does not reproduce YouTube's account-based synchronization.

This was an intentional scope trade-off because the brief requires rebuilding one feature rather than the entire product.

---

## Decision 3 — Add reviewer-controlled demo states

### What we decided

We decided to make the application's important states directly demonstrable through URL parameters and an in-app demo control.

The project supports:

* Normal: `/`
* Loading: `/?demo=loading`
* Error: `/?demo=error`
* Empty: `/?demo=empty`

The demo controls allow a reviewer to switch between these states without changing the source code.

### Alternatives considered

We considered:

* Relying only on real network conditions to produce loading and error states.
* Adding development-only controls that would not be available in the deployed version.
* Using separate pages for each state.
* Using URL-based demo modes together with visible controls.

### Why we chose it

Real network failures are unpredictable. A reviewer should not have to disconnect their internet connection or modify code just to verify the error state.

URL-based demo modes make the states reproducible and shareable, while the visible demo controls make them easy to discover.

The same application components are used for the actual states rather than creating separate mock pages.

### What this costs us

The application contains additional state-handling and demo-mode code that would not be necessary in a minimal production implementation.

It also means the deployed interface contains reviewer-oriented controls that a production product might hide or remove.

We accepted this cost because demonstrating loading, error, and empty states is an explicit requirement of the project assessment.

---

## Summary of the trade-offs

The three decisions prioritize a small, independently runnable frontend over reproducing every part of YouTube's infrastructure.

The main trade-offs are:

* **Wikimedia API:** real data, but dependency on an external service.
* **localStorage:** simple persistence, but no cross-device account synchronization.
* **Demo modes:** reliable reviewability, but additional code and reviewer-oriented UI.

These constraints deliberately keep the project focused on the Watch Later feature rather than expanding it into a full YouTube clone.
