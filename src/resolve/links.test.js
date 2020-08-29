import test from 'ava';
import { settleOpenTabsLinks } from '.';

test('should add a new link from app state to storage', t => {
    const storageLinks = {
        'id1': {
            url: 'url-1',
            title: 'title-1',
            faviconUrl: 'favicon-url-1'
        },
    };
    const openTabsLinks = [{
        id: 'id1',
        url: 'url-1',
        title: 'title-1',
        faviconUrl: 'favicon-url-1'
    },{
        id: 'id2',
        url: 'url-2',
        title: 'title-2',
        faviconUrl: 'favicon-url-2'
    }];
    const expected = {
        'id1': {
            url: 'url-1',
            title: 'title-1',
            faviconUrl: 'favicon-url-1'
        },
        'id2': {
            url: 'url-2',
            title: 'title-2',
            faviconUrl: 'favicon-url-2'
        },
    };
    const actual = settleOpenTabsLinks(storageLinks, openTabsLinks);
    t.deepEqual(actual, expected);
});

test('should overwrite the links from storage with the links from app state', t => {
    const storageLinks = {
        'id1': {
            url: 'url',
            title: 'title',
            faviconUrl: 'favicon-url'
        },
    };
    const openTabsLinks = [{
        id: 'id1',
        url: 'url',
        title: 'title-new',
        faviconUrl: 'favicon-url-new'
    }];
    const expected = {
        'id1': {
            url: 'url',
            title: 'title-new',
            faviconUrl: 'favicon-url-new'
        },
    };
    const actual = settleOpenTabsLinks(storageLinks, openTabsLinks);
    t.deepEqual(actual, expected);
});

test.todo('should remove from storage, links that are removed from all collections in app state');
