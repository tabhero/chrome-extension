<script>
    import { Router } from 'svelte-routing';
    import MainView from './MainView.svelte';

    export let tags;
    export let currentPageIndex;
    export let currentTabUrl;
    export let addTagsInput;
</script>

<Router>
    <MainView
        {tags}
        {currentPageIndex}
        {currentTabUrl}
        {addTagsInput}
        on:tagClick
        on:selectSuggestion
        on:selectNew
        on:clickRight
        on:clickLeft
        on:clickPage />
</Router>

