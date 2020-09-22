<script>
    import UniSearchView from './UniSearchView.svelte';

    let searchInput = '';
    let linksFound = [];
    let collectionsFound = [];
    let tagsFound = [];
</script>

<UniSearchView
    bind:searchInput
    links={linksFound}
    collections={collectionsFound}
    tags={tagsFound} />
