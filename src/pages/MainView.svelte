<script>
    import { createEventDispatcher } from 'svelte';
    import { Link } from 'svelte-routing';
    import { chunk, clamp } from 'lodash-es';

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

    const dispatch = createEventDispatcher();

    $: tagSuggestions = tags
        .filter(tag => tag.name.toLowerCase().startsWith(addTagsInput.toLowerCase()));
    $: pages = chunk(tags, 6);

    function handleClickRight() {
        dispatch('setPage', {
            pageIndex: clamp(currentPageIndex + 1, 0, pages.length - 1)
        });
    }
    function handleClickLeft() {
        dispatch('setPage', {
            pageIndex: clamp(currentPageIndex - 1, 0, pages.length - 1)
        });
    }
    function handleClickPage(event) {
        const { page } = event.detail;
        dispatch('setPage', {
            pageIndex: clamp(page, 0, pages.length - 1)
        });
    }
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
                <ActionButton>Save All Open Tabs</ActionButton>
            </Link>
        </div>
        <div class="row center">
            <Link to="/universal-search">
                <SearchButton>Search Tab Hero</SearchButton>
            </Link>
        </div>
    </section>
    <section>
        <div class="row center">
            <Heading>Manage Tags</Heading>
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
                <CarouselNav numPages={pages.length} currentIndex={currentPageIndex}
                    on:clickRight={handleClickRight}
                    on:clickLeft={handleClickLeft}
                    on:clickPage={handleClickPage} />
            {/if}
        </div>
    </section>
    <section>
        <div class="row center">
            <Heading>Add Tags</Heading>
        </div>
        <div class="row">
            <AddTagBar suggestions={tagSuggestions} bind:input={addTagsInput} float on:selectSuggestion on:selectNew />
        </div>
    </section>
</div>
