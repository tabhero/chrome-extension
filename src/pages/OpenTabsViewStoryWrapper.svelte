<script>
    import { Router } from 'svelte-routing';
    import OpenTabsView from './OpenTabsView.svelte';

    export let links;
    export let collections;
    export let collectionName;
</script>

<Router>
    <OpenTabsView
        {links}
        {collectionName}
        {collections}
        on:saveClick
        on:mergeClick />
</Router>

