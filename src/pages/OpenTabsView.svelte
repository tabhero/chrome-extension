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
    export let savedState = undefined;

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
        dispatch('mergeClick', { matchedCollectionId: matchedCollection.id });
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
        {#if savedState}
            {#if savedState === 'NEW'}
                <Info content={[
                    [false, 'Your new collection'],
                    [true, `"${collectionName}"`],
                    [false, 'has been successfully saved with'],
                    [true, `${links.length}`],
                    [false, 'tabs'],
                ]}/>
            {:else if savedState === 'MERGE'}
                <Info content={[
                    [false, 'The'],
                    [true, `${links.length}`],
                    [false, 'current tabs have been successfully added to your existing collection'],
                    [true, `"${matchedCollection.name}"`],
                ]}/>
            {:else}
                <Info content={[
                    [false, "My developers have made a grave mistake somewhere. As a result, you've entered an"],
                    [true, 'impossible state'],
                    [false, ". We can either both pretend this didn't happen, or you can let them know they messed up"]
                ]}/>
            {/if}
            <div class="row center">
                <Link to="/index.html">
                    <NavLink>Close</NavLink>
                </Link>
            </div>
        {:else}
            <div class="row">
                <nav>
                    <Link to="/index.html">
                        <NavLink>Cancel</NavLink>
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
                    <ActionButton on:click={handleMerge}>Merge</ActionButton>
                {:else}
                    <ActionButton on:click={handleSave}>Save</ActionButton>
                {/if}
            </div>
        {/if}
    </section>
    <section>
        <div class="row">
            <Heading>List of Current Tabs</Heading>
        </div>
        <div class="row">
            <LinksList {links} faviconSize={16} />
        </div>
    </section>
</div>
