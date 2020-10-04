<script>
    import { uniqueId } from '../utils';
    import {
        tags, currentLink,
        addTag as addFirebaseTag,
        toggleTag as toggleFirebaseTag,
    } from '../store.js';
    import MainView from './MainView.svelte';

    let currentPageIndex = 0;
    let addTagsInput = '';

    function toggleTag(event) {
        const { tagId } = event.detail;

        const link = $currentLink;
        if (link) {
            toggleFirebaseTag(tagId, link);
        } else {
            console.log('No current link!');
        }
    }

    function addTag(event) {
        const { tagName } = event.detail;
        const newTag = {
            id: uniqueId(),
            name: tagName,
        };

        const link = $currentLink;
        if (link) {
            addFirebaseTag(newTag, link);
        } else {
            console.log('No current link!');
        }
    }

    function setPage(event) {
        const { pageIndex } = event.detail;
        currentPageIndex = pageIndex;
    }
</script>

<MainView
    currentTabUrl={$currentLink ? $currentLink.url : ''}
    tags={$tags}
    {currentPageIndex}
    bind:addTagsInput
    on:tagClick={toggleTag}
    on:selectSuggestion={toggleTag}
    on:selectNew={addTag}
    on:setPage={setPage} />
