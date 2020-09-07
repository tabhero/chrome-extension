<script>
    import { Link } from 'svelte-routing';
    import { chunk } from 'lodash-es';

    import {
        ActionButton,
        SearchButton,
        TagGrid,
        CarouselNav,
        AddTagBar,
        Heading,
        Info,
    } from '@tabhero/svelte-components';

    export let tags = [];
    export let currentPageIndex = 0;
    export let currentTabUrl = '';
    export let addTagsInput = '';

    $: tagSuggestions = tags
        .filter(tag => tag.name.toLowerCase().startsWith(addTagsInput.toLowerCase()));
    $: pages = chunk(tags, 6);
</script>

<style>
    .url-text {
        font-size: var(--font-size-md);
        overflow-x: hidden;
        overflow-y: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .tag-pages-wrapper {
        min-height: 8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
    }
</style>

<div class="container">
    <section>
        <div class="row center">
            <Link to="/open-tabs">
                <ActionButton text="Save All Open Tabs" />
            </Link>
        </div>
        <div class="row center">
            <SearchButton text="Search Tab Hero" />
        </div>
    </section>
    <section>
        <div class="row center">
            <Heading text="Manage Tags" />
        </div>
        <div class="row center">
            <p class="url-text">{currentTabUrl}</p>
        </div>
        <div class="row tag-pages-wrapper">
            {#if tags.length}
                <TagGrid tags={pages[currentPageIndex]} minRows={3} on:tagClick />
            {:else}
                <Info content={[
                    [true, 'Add a tag'],
                    [false, 'to get started'],
                ]} />
            {/if}
            {#if pages.length > 1}
                <CarouselNav numPages={pages.length} currentIndex={currentPageIndex} on:clickRight on:clickLeft on:clickPage />
            {/if}
        </div>
    </section>
    <section>
        <div class="row center">
            <Heading text="Add Tags" />
        </div>
        <div class="row">
            <AddTagBar suggestions={tagSuggestions} bind:input={addTagsInput} float on:selectSuggestion on:selectNew />
        </div>
    </section>
</div>
