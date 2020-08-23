import OpenTabsViewStoryWrapper from './OpenTabsViewStoryWrapper.svelte';

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

export const OneTab = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [links[0]],
        collectionName: 'foobar',
    },
    on: {},
});

export const ManyTabs = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [...links, ...links, ...links, ...links, ...links, ...links],
        collectionName: 'foobar',
    },
    on: {},
});

export const NoCollectionName = () => ({
    Component: OpenTabsViewStoryWrapper,
    props: {
        links: [...links, ...links, ...links, ...links, ...links, ...links],
        collectionName: '',
    },
    on: {},
});
