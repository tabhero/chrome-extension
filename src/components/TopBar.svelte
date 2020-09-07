<script>
    import { createEventDispatcher } from 'svelte';
    import { Icon } from '@tabhero/svelte-components';

    export let state = 'NOT_LOGGED_IN';
    export let user = '';

    const dispatch = createEventDispatcher();
</script>

<div class="container">
    <aside>
        <button>
            <Icon icon="share" fill="#fff" />
        </button>
    </aside>
    <header>
        <h1>Tab Hero</h1>
        <div>
            {#if state === 'LOGGED_IN'}
                <span class="info logged-in">
                    Logged in as: <span class="user">{user}</span>
                </span>
            {:else if state === 'LOGGING_IN'}
                <span class="info logging-in">Login Flow</span>
            {:else}
                <span class="info not-logged-in" on:click={() => dispatch('login')}>Login to sync data across devices</span>
            {/if}
        </div>
    </header>
    <aside>
        <button>
            <Icon icon="close" fill="#fff" />
        </button>
    </aside>
</div>

<style>
    .container {
        display: flex;

        border-top-left-radius: .5rem;
        border-top-right-radius: .5rem;
        background-color: var(--col-primary);

        color: var(--col-light-primary);

        padding: .5rem;
    }

    header {
        flex-grow: 1;
        text-align: center;
    }

    h1 {
        font-size: var(--font-size-xlg);
        font-weight: var(--font-weight-thic);

        margin-bottom: .25rem;
    }

    .info {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-thin);
    }
    .info.not-logged-in {
        text-decoration: underline;
        cursor: pointer;
    }
    .info.not-logged-in:hover {
        font-weight: var(--font-weight-thicc);
    }

    .user {
        font-weight: var(--font-weight-thicc);
    }

    button {
        border-radius: .5rem;
        border: 1px solid transparent;
        background: transparent;
    }
    button:hover {
        border-color: var(--col-light-primary);
    }
</style>
