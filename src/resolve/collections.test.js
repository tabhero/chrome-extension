import test from 'ava';
import { settleCollections } from '.';

const storageCollections = {
    collections: {
        'col-1': {
            name: 'one',
            createAt: 'created-at',
            updatedAt: 'updated-at',
        }
    },
    links: {
        'col-1': {
            'link-1': {
                url: "url-1",
                title: "title-1",
                faviconUrl: "favicon-1"
            }
        }
    }
};

const currentlyOpenLinks = [{
    id: "link-1",
    url: "url-1",
    title: "title-1",
    faviconUrl: "favicon-1"
}, {
    id: "link-2",
    url: "url-2",
    title: "title-2",
    faviconUrl: "favicon-2"
}];

test('should add a new collection from app state to storage', t => {
    const appCollections = [{
        id: 'col-1',
        name: 'one',
        createAt: 'created-at',
        updatedAt: 'updated-at'
    },{
        id: 'col-2',
        name: 'two',
        createAt: 'created-at',
        updatedAt: 'updated-at'
    }];
    const expected = {
        collections: {
            ...storageCollections.collections,
            'col-2': {
                name: 'two',
                createAt: 'created-at',
                updatedAt: 'updated-at'
            }
        },
        links: {
            ...storageCollections.links,
            'col-2': {
                'link-1': {
                    url: "url-1",
                    title: "title-1",
                    faviconUrl: "favicon-1"
                },
                'link-2': {
                    url: "url-2",
                    title: "title-2",
                    faviconUrl: "favicon-2"
                }
            }
        }
    };
    const actual = settleCollections(storageCollections, appCollections, currentlyOpenLinks, 'col-2');
    t.deepEqual(actual, expected);
});

test('should overwrite the collections from storage with the collections from app state', t => {
    const appCollections = [{
        id: 'col-1',
        name: 'newname',
        createAt: 'created-at',
        updatedAt: 'updated-at'
    }];
    const expected = {
        collections: {
            'col-1': {
                name: 'newname',
                createAt: 'created-at',
                updatedAt: 'updated-at',
            }
        },
        links: {
            'col-1': {
                'link-1': {
                    url: "url-1",
                    title: "title-1",
                    faviconUrl: "favicon-1"
                },
                'link-2': {
                    url: "url-2",
                    title: "title-2",
                    faviconUrl: "favicon-2"
                }
            }
        }
    };
    const actual = settleCollections(storageCollections, appCollections, currentlyOpenLinks, 'col-1');
    t.deepEqual(actual, expected);
});

test.todo('should remove from storage a collection that is removed in app state');
