<script>
    import { Router } from 'svelte-routing';
    import UniSearchView from './UniSearchView.svelte';

    export let searchInput;
    export let links;
    export let collections;
    export let tags;
</script>

<Router>
    <UniSearchView
        {searchInput}
        {links}
        {collections}
        {tags} />
</Router>

