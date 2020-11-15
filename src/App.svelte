<script>
    import { Router, Route } from 'svelte-routing';

    import TopBar from './components/TopBar.svelte';
    import Main from './pages/Main.svelte';
    import OpenTabs from './pages/OpenTabs.svelte';
    import UniSearch from './pages/UniSearch.svelte';

    import { auth } from './services/firebase';
</script>

<style>
    .container {
        /* Max width and height of popup: https://stackoverflow.com/a/47570170 */
        width: 320px;
        height: 540px;

        display: flex;
        flex-direction: column;
    }

    .body {
        flex-grow: 1;

        /* the app body has a border. Hence, overflow at this layer, not at the app container layer */
        overflow: auto;

        border: .1rem solid var(--col-primary);
        border-top: 0;
        border-bottom-left-radius: .5rem;
        border-bottom-right-radius: .5rem;
    }
</style>

<div class="container">
    <TopBar state="" user="" />
    <div class="body">
        <Router>
            <Route path="/index.html" component={Main} />
            <Route path="/open-tabs" component={OpenTabs} />
            <Route path="/universal-search" component={UniSearch} />
        </Router>
    </div>
</div>
