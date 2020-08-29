import test from 'ava';
import { settleCollections } from '.';

test('should add a new collection from app state to storage', t => {
    const storageCollections = {
        'id1': {
            name: 'one',
            createAt: 'created-at',
            updatedAt: 'updated-at',
            links: ['link-one']
        }
    };
    const appCollections = [{
        id: 'id1',
        name: 'one',
        createAt: 'created-at',
        updatedAt: 'updated-at',
        links: ['link-one']
    },{
        id: 'id2',
        name: 'name',
        createAt: 'created-at',
        updatedAt: 'updated-at',
        links: ['link-one', 'link-two']
    }];
    const expected = {
        ...storageCollections,
        'id2': {
            name: 'name',
            createAt: 'created-at',
            updatedAt: 'updated-at',
            links: ['link-one', 'link-two']
        }
    };
    const actual = settleCollections(storageCollections, appCollections);
    t.deepEqual(actual, expected);
});

test('should overwrite the collections from storage with the collections from app state', t => {
    const storageCollections = {
        'id1': {
            name: 'name',
            createAt: 'created-at',
            updatedAt: 'updated-at',
            links: ['link-one']
        }
    };
    const appCollections = [{
        id: 'id1',
        name: 'name',
        createAt: 'created-at',
        updatedAt: 'updated-at',
        links: ['link-one', 'link-two']
    }];
    const expected = {
        'id1': {
            name: 'name',
            createAt: 'created-at',
            updatedAt: 'updated-at',
            links: ['link-one', 'link-two']
        }
    };
    const actual = settleCollections(storageCollections, appCollections);
    t.deepEqual(actual, expected);
});

test.todo('should remove from storage a collection that is removed in app state');
