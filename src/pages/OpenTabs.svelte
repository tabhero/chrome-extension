<script>
    import { onMount } from 'svelte';
    import { getCurrentWindowTabs } from '../services/chrome';
    import { uniqueId } from '../utils';
    import { collections, addCollection } from '../store';

    import OpenTabsView from './OpenTabsView.svelte';

    let openTabs = [];
    let collectionName = '';
    let savedState = undefined;

    onMount(async () => {
        openTabs = await getCurrentWindowTabs();
    });

    async function saveCollection() {
        const newCollection = {
            id: uniqueId(),
            name: collectionName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addCollection(newCollection, openTabs);
        savedState = 'NEW';
    }

    async function mergeCollection(event) {
        const { matchedCollectionId } = event.detail;

        const collectionsValue = $collections;
        let matchedCollection = collectionsValue.find(col => col.id === matchedCollectionId);
        if (matchedCollection) {
            matchedCollection = {
                ...matchedCollection,
                updatedAt: new Date().toISOString()
            };
            addCollection(matchedCollection, openTabs);
            savedState = 'MERGE';
        } else {
            console.log('No collection to merge with!');
        }
    }
</script>

<OpenTabsView
    links={openTabs}
    collections={$collections}
    {savedState}
    bind:collectionName
    on:saveClick={saveCollection}
    on:mergeClick={mergeCollection} />
