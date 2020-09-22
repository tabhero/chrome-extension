<script>
    import { onMount } from 'svelte';
    import Fuse from 'fuse.js';

    import UniSearchView from './UniSearchView.svelte';
    import { initUniSearchState } from '../sync';
    import { getCurrentTab } from '../services/chrome';

    let linksSearch;
    let collectionsSearch;
    let tagsSearch;

    let searchInput = '';

    onMount(async () => {
        const currentTab = await getCurrentTab();
        const { links, collections, tags } = await initUniSearchState(currentTab);

        linksSearch = new Fuse(links, {
            keys: ['url', 'title']
        });
        collectionsSearch = new Fuse(collections, {
            keys: ['name']
        });
        tagsSearch = new Fuse(tags, {
            keys: ['name']
        });
    });

    const mapItem = (list) => list.map(({ item }) => item);

    $: linksFound = linksSearch ? mapItem(linksSearch.search(searchInput)) : [];
    $: collectionsFound = collectionsSearch ? mapItem(collectionsSearch.search(searchInput)) : [];
    $: tagsFound = tagsSearch ? mapItem(tagsSearch.search(searchInput)) : [];
</script>

<UniSearchView
    bind:searchInput
    links={linksFound}
    collections={collectionsFound}
    tags={tagsFound} />
