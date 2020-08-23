<script>
    import { Link } from 'svelte-routing';

    import {
        ActionButton,
        SearchButton,
        TagPages,
        AddTagBar,
        Heading
    } from '@tabhero/svelte-components';

    export let tags = [];
    export let currentTabUrl = '';
    export let addTagsInput = '';

    $: tagSuggestions = tags
        .filter(tag => tag.name.toLowerCase().startsWith(addTagsInput.toLowerCase()));
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
    }
    .tag-pages-wrapper > :global(*) {
        /* the min-height of the parent means we gotta center this child */
        /* height: 100% here doesn't work for some reason, so using this instead */
        flex: 1;
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
            <TagPages {tags} on:tagClick />
        </div>
    </section>
    <section>
        <div class="row center">
            <Heading text="Add Tags" />
        </div>
        <div class="row">
            <AddTagBar suggestions={tagSuggestions} bind:input={addTagsInput} on:selectSuggestion on:selectNew />
        </div>
    </section>
</div>
