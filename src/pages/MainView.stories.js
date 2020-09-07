import { action } from '@storybook/addon-actions';

import MainViewStoryWrapper from './MainViewStoryWrapper.svelte';

export default {
    title: 'Pages/MainView',
    component: MainViewStoryWrapper,
};

const tags = [
    { id: 'xyz', added: true, name: 'Youtube' },
    { id: 'xyz', added: true, name: 'Coffee!' },
    { id: 'xyz', added: true, name: 'Study Philosophy' },
    { id: 'xyz', added: false, name: 'Events' },
    { id: 'xyz', added: false, name: 'Reading List' },
    { id: 'xyz', added: false, name: 'Medium' },
    { id: 'xyz', added: false, name: 'Design' },
    { id: 'xyz', added: false, name: 'On The Road' },
    { id: 'xyz', added: true, name: 'Recipe' },
    { id: 'xyz', added: false, name: 'Want To Watch' },
    { id: 'xyz', added: true, name: 'Docs' },
];

const eventHandlers = {
    tagClick: action('tagClicked'),
    selectSuggestion: action('selectSuggestion'),
    selectNew: action('selectNew'),
    clickRight: action('clickRight'),
    clickLeft: action('clickLeft'),
    clickPage: action('clickPage'),
};

export const NoTagsExist = () => ({
    Component: MainViewStoryWrapper,
    props: {
        tags: [],
        currentPageIndex: 0,
        currentTabUrl: 'www.google.co.in',
        addTagsInput: ''
    },
    on: eventHandlers
});

export const OneTaggridPage = () => ({
    Component: MainViewStoryWrapper,
    props: {
        tags: tags.slice(0, 6),
        currentPageIndex: 0,
        currentTabUrl: 'www.google.co.in',
        addTagsInput: ''
    },
    on: eventHandlers
});

export const ManyTaggridPages = () => ({
    Component: MainViewStoryWrapper,
    props: {
        tags: [...tags, ...tags],
        currentPageIndex: 2,
        currentTabUrl: 'www.google.co.in',
        addTagsInput: ''
    },
    on: eventHandlers
});

export const EmptyRowsOnLastTaggridPage = () => ({
    Component: MainViewStoryWrapper,
    props: {
        tags: tags.slice(0, 8),
        currentPageIndex: 1,
        currentTabUrl: 'www.google.co.in',
        addTagsInput: ''
    },
    on: eventHandlers
});

export const AddTagsCaseInsensitiveButNonMatchingSuggestion = () => ({
    Component: MainViewStoryWrapper,
    props: {
        tags: tags,
        currentPageIndex: 0,
        currentTabUrl: 'www.google.co.in',
        addTagsInput: 'recipe'
    },
    on: eventHandlers
});
