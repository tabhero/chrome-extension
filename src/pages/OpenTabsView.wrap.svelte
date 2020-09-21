<script>
    import { Router } from 'svelte-routing';
    import OpenTabsView from './OpenTabsView.svelte';

    export let links;
    export let collections;
    export let collectionName;
    export let savedState;
</script>

<Router>
    <OpenTabsView
        {links}
        {collectionName}
        {collections}
        {savedState}
        on:saveClick
        on:mergeClick />
</Router>

