<script>
    import { Link } from 'svelte-routing';

    import {
        LinksList,
        Heading,
        ActionButton,
        Info,
        Input,
        NavLink
    } from '@tabhero/svelte-components';

    import { twelveHourTime } from '../utils';

    export let links = [];
    export let collectionName = '';

    $: if (collectionName === '') {
        const currentDate = new Date();
        collectionName = `${twelveHourTime(currentDate)}, ${currentDate.toDateString()}`;
    }
</script>

<style>
    nav {
        display: flex;
        justify-content: flex-end;
    }
</style>

<div class="container">
    <section>
        <div class="row">
            <nav>
                <Link to="/index.html">
                    <NavLink text="Cancel" />
                </Link>
            </nav>
        </div>
        <div class="row center">
            <Input bind:value={collectionName} placeholder="Enter a name for your collection" />
        </div>
        <div class="row center">
            <Info content={[
                [false, 'You have'],
                [true, `${links.length} tab${links.length !== 1 ? 's' : ''}`],
                [false, 'currently open'],
            ]}/>
        </div>
        <div class="row center">
            <ActionButton text="Save" />
        </div>
    </section>
    <section>
        <div class="row">
            <Heading text="List of Current Tabs" />
        </div>
        <div class="row">
            <LinksList {links} faviconSize={16} />
        </div>
    </section>
</div>
