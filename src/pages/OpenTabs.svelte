<script>
    import { onMount } from 'svelte';
    import { getCurrentWindowTabs } from '../services/chrome';
    import { initOpenTabsState, openTabsStateToStorage } from '../sync';
    import { uniqueId } from '../utils';

    import OpenTabsView from './OpenTabsView.svelte';

    let links = [];
    let collections = [];
    let collectionName = '';

    onMount(async () => {
        const tabs = await getCurrentWindowTabs();
        const { openLinks, collections: cols } = await initOpenTabsState(tabs);

        links = openLinks;
        collections = cols;
    });

    async function saveCollection(event) {
        const { collectionName } = event.detail;

        const newCollection = {
            id: uniqueId(),
            name: collectionName,
            createAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        collections = [...collections, newCollection];
        await openTabsStateToStorage(links, collections, newCollection.id);
    }
</script>

<OpenTabsView
    {links}
    {collectionName}
    on:saveClick={saveCollection} />
