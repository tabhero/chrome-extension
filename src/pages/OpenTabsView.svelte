<script>
    import { Link } from 'svelte-routing';
    import { createEventDispatcher } from 'svelte';
    import {
        LinksList,
        Heading,
        ActionButton,
        Info,
        Input,
        NavLink
    } from '@tabhero/svelte-components';

    import { twelveHourTime } from '../utils';

    export let links = [];
    export let collections = [];
    export let collectionName = '';

    const dispatch = createEventDispatcher();

    $: if (collectionName === '') {
        const currentDate = new Date();
        collectionName = `${twelveHourTime(currentDate)}, ${currentDate.toDateString()}`;
    }

    $: matchedCollection = collections.find(({ name }) => name === collectionName);

    function handleSave() {
        dispatch('saveClick', { collectionName });
    }

    function handleMerge() {
        dispatch('mergeClick', { collectionName: matchedCollection.name });
    }
</script>

<style>
    nav {
        display: flex;
        justify-content: flex-end;
    }
</style>

<div class="container">
    <section>
        <div class="row">
            <nav>
                <Link to="/index.html">
                    <NavLink text="Cancel" />
                </Link>
            </nav>
        </div>
        <div class="row center">
            <Input bind:value={collectionName} placeholder="Enter a name for your collection" />
        </div>
        <div class="row center">
            {#if matchedCollection}
                <Info content={[
                    [true, `"${collectionName}"`],
                    [false, 'is an existing collection. Please'],
                    [true, 'edit the collection name'],
                    [false, 'or'],
                    [true, 'merge the current tabs'],
                    [false, 'with the existing collection'],
                ]}/>
            {:else}
                <Info content={[
                    [false, 'You have'],
                    [true, `${links.length} tab${links.length !== 1 ? 's' : ''}`],
                    [false, 'currently open'],
                ]}/>
            {/if}
        </div>
        <div class="row center">
            {#if matchedCollection}
                <ActionButton text="Merge" on:click={handleMerge} />
            {:else}
                <ActionButton text="Save" on:click={handleSave} />
            {/if}
        </div>
    </section>
    <section>
        <div class="row">
            <Heading text="List of Current Tabs" />
        </div>
        <div class="row">
            <LinksList {links} faviconSize={16} />
        </div>
    </section>
</div>
