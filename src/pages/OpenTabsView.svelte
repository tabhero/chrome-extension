<script>
    import { Link } from 'svelte-routing';
    import { createEventDispatcher } from 'svelte';
    import {
        List,
        Link as TabLink,
        Heading,
        ActionButton,
        Info,
        Input,
        NavLink
    } from '@tabhero/svelte-components';

    import { twelveHourTime } from '../utils';
    import { collectionSavedState } from '../enums';

    export let links = [];
    export let collections = [];
    export let collectionName = '';
    export let savedState = collectionSavedState.NOT_SAVED;

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

    .container {
        /* minmax(0, 1fr) prevents a grid blowout */
        /* https://stackoverflow.com/a/43312314 */
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: auto minmax(0, 1fr);
        height: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
    }

    section > .scrollable-body {
        flex: 1;
        overflow: auto;
    }
</style>

<div class="container">
    <section>
        {#if savedState === collectionSavedState.NEW || savedState === collectionSavedState.MERGE}
            <div class="row">
                {#if savedState === collectionSavedState.NEW}
                    <Info content={[
                        [false, 'Your new collection'],
                        [true, `"${collectionName}"`],
                        [false, 'has been successfully saved with'],
                        [true, `${links.length}`],
                        [false, 'tabs'],
                    ]}/>
                {:else if savedState === collectionSavedState.MERGE}
                    <Info content={[
                        [false, 'The'],
                        [true, `${links.length}`],
                        [false, 'current tabs have been successfully added to your existing collection'],
                        [true, `"${matchedCollection.name}"`],
                    ]}/>
                {/if}
            </div>
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
        <div class="row scrollable-body">
            <List items={links} let:item={{ title, url, faviconUrl }}>
                <TabLink {title} {url} {faviconUrl} faviconSize={16} />
            </List>
        </div>
    </section>
</div>
