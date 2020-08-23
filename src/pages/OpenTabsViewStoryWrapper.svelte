<script>
    import { Router } from 'svelte-routing';
    import OpenTabsView from './OpenTabsView.svelte';

    export let links;
    export let collectionName;
</script>

<Router>
    <OpenTabsView
        {links}
        {collectionName} />
</Router>

