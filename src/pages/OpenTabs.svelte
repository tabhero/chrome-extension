<script>
    import { onMount } from 'svelte';
    import { getCurrentWindowTabs } from '../services/chrome';
    import { initOpenTabsState } from '../sync';

    import OpenTabsView from './OpenTabsView.svelte';

    let links = [];

    onMount(async () => {
        const tabs = await getCurrentWindowTabs();
        const { openLinks, collections } = await initOpenTabsState(tabs);

        links = openLinks;

        console.log(tabs);
        console.log(openLinks);
        console.log(collections);
    });
</script>

<OpenTabsView {links} />
