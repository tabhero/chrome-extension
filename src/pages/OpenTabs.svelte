<script>
    import { onMount } from 'svelte';
    import { getCurrentWindowTabs } from '../services/chrome';
    import { getAllCollections } from '../services/storage';
    import { initOpenTabsState, openTabsStateToStorage } from '../sync';
    import { mergeLinks } from '../resolve';
    import { uniqueId } from '../utils';

    import OpenTabsView from './OpenTabsView.svelte';

    let links = [];
    let collections = [];
    let collectionName = '';
    let savedState = undefined;

    onMount(async () => {
        const tabs = await getCurrentWindowTabs();
        const { openLinks, collections: cols } = await initOpenTabsState(tabs);

        links = openLinks;
        collections = cols;
    });

    async function saveCollection() {
        const newCollection = {
            id: uniqueId(),
            name: collectionName,
            createAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        collections = [...collections, newCollection];
        await openTabsStateToStorage(links, collections, newCollection.id);
        savedState = 'NEW';
    }

    async function mergeCollection(event) {
        const { matchedCollectionId } = event.detail;

        collections = collections.map(c => {
            return c.id === matchedCollectionId
                ? { ...c, updatedAt: new Date().toISOString() }
                : c;
        });

        const collectionStorage = await getAllCollections();
        const linksOfCollection = collectionStorage.links[matchedCollectionId];
        const existingLinks = linksOfCollection
            ? Object.entries(linksOfCollection).map(([ id, body ]) => ({ id, ...body }))
            : [];

        const mergedLinks = mergeLinks(existingLinks, links);
        await openTabsStateToStorage(mergedLinks, collections, matchedCollectionId);
        savedState = 'MERGE';
    }
</script>

<OpenTabsView
    {links}
    {collections}
    {savedState}
    bind:collectionName
    on:saveClick={saveCollection}
    on:mergeClick={mergeCollection} />
