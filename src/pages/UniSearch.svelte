<script>
    import { onMount } from 'svelte';
    import Fuse from 'fuse.js';

    import UniSearchView from './UniSearchView.svelte';
    import { tags, collections, firestoreLinks as links } from '../store';

    let linksSearch;
    let collectionsSearch;
    let tagsSearch;

    let searchInput = '';

    onMount(() => {
        const unsubTags = tags.subscribe(tags => {
            tagsSearch = new Fuse(tags, {
                keys: ['name']
            });
        });
        const unsubCollections = collections.subscribe(collections => {
            collectionsSearch = new Fuse(collections, {
                keys: ['name']
            });
        });
        const unsubLinks = links.subscribe(links => {
            linksSearch = new Fuse(links, {
                keys: ['url', 'title']
            });
        });

        return () => {
            unsubTags();
            unsubCollections();
            unsubLinks();
        };
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
