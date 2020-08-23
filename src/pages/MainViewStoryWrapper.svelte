<script>
    import { Router } from 'svelte-routing';
    import MainView from './MainView.svelte';

    export let tags;
    export let currentTabUrl;
    export let addTagsInput;
</script>

<Router>
    <MainView
        {tags}
        {currentTabUrl}
        {addTagsInput}
        on:tagClick
        on:selectSuggestion
        on:selectNew />
</Router>

