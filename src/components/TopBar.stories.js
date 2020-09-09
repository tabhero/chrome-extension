import { action } from '@storybook/addon-actions';

import TopBar from './TopBar.svelte';
import { loginState } from '../enums';

export default {
    title: 'TopBar',
    component: TopBar,
};

export const NotLoggedInDefaultAndHover = () => ({
    Component: TopBar,
    props: {
        state: loginState.NOT_LOGGED_IN,
        user: null,
    },
    on: { login: action('login') }
});

export const LoggingIn = () => ({
    Component: TopBar,
    props: {
        state: loginState.LOGGING_IN,
        user: 'somebody@example.com',
    },
    on: { login: action('login') }
});

export const LoggedInAndHoverOnIcons = () => ({
    Component: TopBar,
    props: {
        state: loginState.LOGGED_IN,
        user: 'somebody@example.com',
    },
    on: { login: action('login') }
});
