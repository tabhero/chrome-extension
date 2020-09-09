<script>
    import { uniqueId } from '../utils';
    import { currentTabTags, currentTabLink } from '../store.js';

    import MainView from './MainView.svelte';

    let currentPageIndex = 0;
    let addTagsInput = '';

    function addExistingTag(event) {
        const { tagId } = event.detail;
        currentTabTags.update(prev => {
            return prev.map(tag => (
                tag.id === tagId
                    ? { ...tag, added: !tag.added }
                    : tag
            ));
        });
    }

    function addNewTag(event) {
        const { tagName } = event.detail;
        const newTag = {
            id: uniqueId(),
            name: tagName,
            added: true
        };
        currentTabTags.update(prev => [newTag, ...prev]);
    }

    function setPage(event) {
        const { pageIndex } = event.detail;
        currentPageIndex = pageIndex;
    }
</script>

<MainView
    currentTabUrl={$currentTabLink ? $currentTabLink.url : ''}
    tags={$currentTabTags}
    {currentPageIndex}
    {addTagsInput}
    on:tagClick={addExistingTag}
    on:selectSuggestion={addExistingTag}
    on:selectNew={addNewTag} />
    on:setPage={setPage} />
