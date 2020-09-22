<script>
    import { Link } from 'svelte-routing';
    import {
        SearchBar,
        Heading,
        List,
        Collection,
        Link as TabLink,
        NavLink,
        TagGrid,
    } from '@tabhero/svelte-components';

    export let searchInput = '';
    export let links = [];
    export let collections = [];
    export let tags = [];

    $: collections = collections.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
    }))
</script>

<div>
    <section>
        <div class="row">
            <nav>
                <Link to="/index.html">
                    <NavLink>Cancel</NavLink>
                </Link>
            </nav>
        </div>
        <div class="row">
            <SearchBar bind:value={searchInput} placeholder="Search for collections, tags and links" />
        </div>
    </section>
    <section>
        <div class="row">
            <Heading>Collections</Heading>
        </div>
        <div class="row">
            {#if collections.length}
                <List items={collections} let:item={collection}>
                    <Collection {...collection} />
                </List>
            {:else}
                <p>No Collections found matching '{searchInput}'</p>
            {/if}
        </div>
    </section>
    <section>
        <div class="row">
            <Heading>Tags</Heading>
        </div>
        <div class="row">
            {#if tags.length}
                <TagGrid {tags} />
            {:else}
                <p>No Tags found matching '{searchInput}'</p>
            {/if}
        </div>
    </section>
    <section>
        <div class="row">
            <Heading>Saved Links</Heading>
        </div>
        <div class="row">
            {#if links.length}
                <List items={links} let:item={link}>
                    <TabLink {...link} faviconSize={16} />
                </List>
            {:else}
                <p>No Saved Links found matching '{searchInput}'</p>
            {/if}
        </div>
    </section>
</div>

<style>
    nav {
        display: flex;
        justify-content: flex-end;
    }
</style>
