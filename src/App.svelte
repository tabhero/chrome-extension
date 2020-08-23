<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { Router, Route } from "svelte-routing";
    import { TopBar } from '@tabhero/svelte-components';

    import Main from './pages/Main.svelte';
    import OpenTabs from './pages/OpenTabs.svelte';

    import { currentTabTags, currentTabLink } from './store.js';
    import { getCurrentTab, registerOnTabUpdate } from './services/chrome';
    import { initTagsState, tagsStateToStorage } from './sync';

    onMount(async () => {
        const currentTab = await getCurrentTab();
        const { tags, currentLink } = await initTagsState(currentTab);
        currentTabTags.set(tags);
        currentTabLink.set(currentLink);

        const removeListener = registerOnTabUpdate(async (newTab) => {
            const { tags, currentLink } = await initTagsState(newTab);
            currentTabTags.set(tags);
            currentTabLink.set(currentLink);
        });

        return async () => {
            removeListener();
        };
    });

    const unsubscribe = currentTabTags.subscribe(async tags => {
        await tagsStateToStorage(get(currentTabTags), get(currentTabLink));
    });

    onDestroy(unsubscribe);
</script>

<style>
    .container {
        /* Max width and height of popup: https://stackoverflow.com/a/47570170 */
        width: 310px;
        height: 540px;

        display: flex;
        flex-direction: column;
    }

    .body {
        flex-grow: 1;

        /* the app body has a border. Hence, overflow at this layer, not at the app container layer */
        overflow: auto;

        border: .1rem solid var(--col-primary);
        border-top: 0;
        border-bottom-left-radius: .5rem;
        border-bottom-right-radius: .5rem;
    }
</style>

<div class="container">
    <TopBar state="" user="" />
    <div class="body">
        <Router>
            <Route path="/index.html" component={Main} />
            <Route path="/open-tabs" component={OpenTabs} />
        </Router>
    </div>
</div>
