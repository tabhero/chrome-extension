import { action } from '@storybook/addon-actions';
import UniSearchViewWrapper from './UniSearchView.wrap.svelte';

export default {
    title: 'Pages/UniversalSearchView',
    component: UniSearchViewWrapper,
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
    id: '1',
    name: 'Movies To Watch',
    createdAt: new Date('2020-08-21T17:14:28.000Z'),
    updatedAt: new Date('2020-08-21T17:17:12.616Z'),
    numTabs: 13
}, {
    id: '2',
    name: 'JS MDN Docs',
    createdAt: new Date('2020-08-21T17:17:22.821Z'),
    updatedAt: new Date('2020-08-21T17:17:22.821Z'),
    numTabs: 25
}];

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

export const SearchResultsFound = () => ({
    Component: UniSearchViewWrapper,
    props: {
        searchInput: 'some sample input',
        links: links,
        collections: collections,
        tags: tags,
    },
    on: {},
});

export const NoSearchResultsFound = () => ({
    Component: UniSearchViewWrapper,
    props: {
        searchInput: 'some sample input',
        links: [],
        collections: [],
        tags: [],
    },
    on: {},
});
