# TabHero

A Chrome extension for tab management.

## Setup

- `git clone` this repo
- `npm install` to install dependencies

## Development

### Developing Components

The components can be developed in isolation in storybook: `npm run storybook`

### Developing the App

The `public` folder is where the svelte-built chrome extension lives. The html files there should reference the svelte js bundles. Hot-reloading isn't set up. So to develop, use the following workflow:

1. Run `npm run build` to build the app.
2. Put chrome in developer mode and load the extension into chrome using "Load Unpacked".
3. Seed the extension's `chrome.storage.local` with data from the `seed` directory, using the file names as the key and their contents as the value. For this, use a tool like [Storage Area Explorer](https://chrome.google.com/webstore/detail/storage-area-explorer/ocfjjjjhkpapocigimmppepjgfdecjkb?hl=en).
4. You can now either run the extension's popup, or view the extension in its own tab by visiting `chrome-extension://<your-chrome-extension-id>/index.html`
5. Continue development by re-building the app and re-opening the popup or refreshing the extension's dedicated development tab. Reloading the extension itself is not necessary.

The app would not work in development through `npm run dev`, because this will start the Svelte dev server, which serves the app in a web context, where the Chrome APIs are not available.

## Behaviour

- The app popup exists within the context of a single chrome tab. On switching chrome tabs, the popup should backup the state into the chrome storage and then a new app popup should be instantiated, loading data associated with the new tab from the storage.
- When a browser tab changes, only the ID of the associated link in the DB should remain the same. Other fields like favicon, title and other web resources would get the lastest value from the new tab. This would result in an auto-update of the fields of that link. So when the title/favicon of a website is changed, our DB gets that change. Also, when a tab changes, we use the tab's url to find the link having that url in the DB. Because of this, the URL would automatically also persist like the ID.
- Links get autocleaned, but tags and collections don't. This means when a link is no longer associated with any tag or collection, it gets deleted from the DB. But if a tag or collection is no longer associated with any link, it remains in the DB.
- There is one backend and multiple frontends. The backend state represents the persistent state (there are intermediate persistent states, like chrome.local.storage, but ignore those for now). For each frontend, the frontend state will be initialised from the backend state on startup. For each write operation to the frontend state, the backend state will be updated to match the frontend state. As a result of this model:
    - The frontend state is not reactive. For example, if we change the state in frontend X, that state change will not be reflected in frontend Y until Y is restarted.
    - We don't have to handle state conflicts between the frontend and the backend. The frontend state takes precedence and overwrites the backend state.
    - When frontend X is switched off, there is no guarantee that on the next startup, the state of X will be the same as before switching off. This is because frontend Y might have overwritten the backend state that X is initialised from. We can have this guarantee only for the very last frontend that wrote to the backend.
    - When a frontend goes offline, and other online frontends exists, then any state updates to the offline frontend is no longer syncable. Those updates will live only till it goes back online, during which it'll all be overwritten.

## Anomalies

1. [ ] When app is opened while a page is loading, two syncs occur: 1) App's mount syncs data from storage, 2) Page's "on load complete" syncs data from storage. If any action is performed between the two syncs (like adding a new tag to the page), the resultant state is overridden by the second sync.

## Suggestions

1. [ ] Visual element showing whether the app is synced with local storage or synced with the backend, like how google docs does it.
2. [ ] In AddTag bar, even when a tag has been added, it shows up in the search results. Either we don't show them (but then we'd have to give user feedback somehow) or we let the user either 1) see a non-clickable "already added" prompt or 2) see a "remove tag" prompt, making the entire component a Add/Remove Tag component
3. [ ] In Save All Open Tabs, let the user
    1. select which tabs to save to the collection
    2. choose if they wanna close all the tabs that are saved to the collection (useful if they might wanna save a tab to multiple collections)
    3. see the tabs grouped into the window they're in
    4. go the desired opened tab by clicking on it
4. [ ] In universal search flow, we currently can show all links assoc. with one tag. Provide a way to see all links assoc. with multiple tags.
5. [ ] "Save To Open Tabs" button should use a different UI element to indicate navigation. Currently, its behaviour is inconsistent with the behaviour "Merge" and "Save" buttons have, despite all using the same UI element.
6. [ ] Show a list of tags assoc with the currently active browser tab separately from the list of all tags. Useful for quick removal.

## Heads Up

- Unique IDs use the `nanoid` npm package, which unfortunately doesn't comply with rollup's bundling conventions. So we use a workaround, [rollup-plugin-inject-process-env](https://www.npmjs.com/package/rollup-plugin-inject-process-env) to make it work. A discussion on this can be found on [rollup/issues#487](https://github.com/rollup/rollup/issues/487).
- `rollup-plugin-inject-process-env` breaks the functionality of `rollup-plugin-postcss` when placed before `rollup-plugin-postcss` in the Rollup plugin pipeline. Don't know why this happens. We need `rollup-plugin-postcss` so we can use the `@tabhero/svelte-components` package. Could file a bug report on `rollup-plugin-inject-process-env` or use a different plugin for the same purpose, or put up with it for now.
- The stories of the page views broke because the page views import `svelte-routing`'s `Link` component, which can't be rendered without the existence of `svelte-routing`'s `Router` and `Route` components higher up in the component tree. So we'd need to wrap these stories as well in `Router` and `Route`, but we can't do that with the current storybook syntax for Svelte. The Svelte storybook team plans to support the Svelte syntax in stories (mentioned [here](https://www.npmjs.com/package/@storybook/svelte)), and there's a [Storybook PR #7682](https://github.com/storybookjs/storybook/pull/7682) regarding this same goal. For now, a workaround would be to make more svelte components that would wrap the actual components we're making stories of, and use those wrappers in the stories. An example of that is given [here](https://github.com/storybookjs/storybook/tree/next/examples/svelte-kitchen-sink). There's an alternative to storybook meant specifically for Svelte components, [svench](https://github.com/rixo/svench), that's made by the same person who raised the PR. The PR seems to have been dropped in favour of this, but it still looks pretty experimental for now.

## Challenges

- Handling state conflicts between multiple frontends
    - Each frontend is aware of only the backend state
- Aiming for small reads/writes to persistent storage, rather than the bulk version we're doing in the chrome extension right now.

## Extras

- http://bokardo.com/principles-of-user-interface-design/
- https://grow.google/jobuxdesign/
- https://grow.google/jobprojectmanage/
- https://grow.google/jobdataanalyst/
