import { action } from '@storybook/addon-actions';
import OpenTabsViewStoryWrapper from './OpenTabsViewStoryWrapper.svelte';

import { collectionSavedState } from '../enums';

export default {
    title: 'Pages/OpenTabsView',
    component: OpenTabsViewStoryWrapper,
};

const links = [{
    id: 'xyz',
    title: 'avajs/ava: Node.js test runner that lets you develop with confidence 🚀',
    url: 'https://github.com/avajs/ava',
    faviconUrl: 'https://github.githubassets.com/favicons/favicon.svg'
}, {
    id: 'xyz',
    title: 'Making The Subway Meatball Sub At Home | But Better - YouTube',
    url: 'https://www.youtube.com/watch?v=3Abk2WWuoao',
    faviconUrl: 'https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png'
}, {
    id: 'xyz',
    title: 'Second Crusade - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/Second_Crusade',
    faviconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
}, {
    id: 'xyz',
    title: 'Taking Hash Tables Off The Shelf. Truth time: learning about theoretical… | by Vaidehi Joshi | basecs | Medium',
    url: 'https://medium.com/basecs/taking-hash-tables-off-the-shelf-139cbf4752f0',
    faviconUrl: 'https://medium.com/favicon.ico'
}];

const collections = [{
    id: 'Mk9|0Xb+Gp+m&_5i=J',
    name: 'Movies To Watch',
    createdAt: '2020-08-21T17:14:28.000Z',
    updatedAt: '2020-08-21T17:17:12.616Z'
}, {
    id: 'R2ob3iTSHSJn,{ulw[',
    name: 'JS MDN Docs',
    createdAt: '2020-08-21T17:17:22.821Z',
    updatedAt: '2020-08-21T17:17:22.821Z'
}];

export const OneTab = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [links[0]],
        collections: collections,
        collectionName: 'foobar',
        savedState: undefined,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const ManyTabs = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [...links, ...links, ...links, ...links, ...links, ...links],
        collections: collections,
        collectionName: 'foobar',
        savedState: undefined,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const NoCollectionName = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [...links, ...links, ...links, ...links, ...links, ...links],
        collections: collections,
        collectionName: '',
        savedState: undefined,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const InputMatchesExistingCollectionName = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: links,
        collections: collections,
        collectionName: 'Movies To Watch',
        savedState: undefined,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const NewCollectionSaved = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: links,
        collections: collections,
        collectionName: 'foobar',
        savedState: collectionSavedState.NEW,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const NewCollectionMergedToExisting = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: links,
        collections: collections,
        collectionName: 'Movies To Watch',
        savedState: collectionSavedState.MERGE,
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});

export const ImpossibleSavedState = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: links,
        collections: collections,
        collectionName: 'foobar',
        savedState: 'IMPOSSIBLE_BOI',
    },
    on: {
        saveClick: action('saveClick'),
        mergeClick: action('mergeClick'),
    },
});
