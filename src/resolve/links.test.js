import test from 'ava';
import { settleOpenTabsLinks, mergeLinks } from '.';

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

test('should merge links if no two links have the same url', t => {
    const links1 = [{
        id: "link-1",
        url: "url-1",
        title: "title-1",
        faviconUrl: "favicon-1"
    }];
    const links2 = [{
        id: "link-2",
        url: "url-2",
        title: "title-1",
        faviconUrl: "favicon-1"
    }];
    const expected = [...links2, ...links1];
    const actual = mergeLinks(links1, links2);
    t.deepEqual(actual, expected);
});

test('should merge links and links of second arg should overwrite those of first arg if same url', t => {
    const links1 = [{
        id: "link-1",
        url: "url-1",
        title: "title-1",
        faviconUrl: "favicon-1"
    }, {
        id: "link-x",
        url: "url-x",
        title: "title-x",
        faviconUrl: "favicon-x"
    }];
    const links2 = [{
        id: "link-2",
        url: "url-1",
        title: "title-2",
        faviconUrl: "favicon-2"
    }];
    const expected = [{
        id: "link-2",
        url: "url-1",
        title: "title-2",
        faviconUrl: "favicon-2"
    }, {
        id: "link-x",
        url: "url-x",
        title: "title-x",
        faviconUrl: "favicon-x"
    }];
    const actual = mergeLinks(links1, links2);
    t.deepEqual(actual, expected);
});
