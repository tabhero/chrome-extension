import { writable, readable, derived } from 'svelte/store';

import firebase, { firestore } from './services/firebase';
import { getCurrentTab, registerOnTabUpdate } from './services/chrome';
import { normalUrl, linkFromTab } from './utils';
import { mapTabsToLinks } from './resolve/tabLink';

export const currentTabTags = writable([]);
export const currentTabLink = writable(null);

const toDomain = (documentSnapshot) => {
    return {
        ...documentSnapshot.data(),
        id: documentSnapshot.id,
    };
};

const getStoreFromCollection = (collectionName) => {
    return readable([], function start(set) {
        const unsubscribe = firestore.collection(collectionName).onSnapshot({
            next: (snapshot) => {
                const docs = snapshot.docs.map(doc => toDomain(doc));
                set(docs);
            },
            error: (error) => {
                console.log(error);
            }
        });
        return function stop() {
            unsubscribe();
        };
    });
};

export const tags = getStoreFromCollection('tags');

export const collections = getStoreFromCollection('collections');

const listenLinkUpdate = (url, callback) => {
    return firestore.collection('links')
        .where('url', '==', normalUrl(url))
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                return callback(null);
            }
            const doc = snapshot.docs[0];
            const link = toDomain(doc);
            callback(link);
        });
};

export const currentLink = readable(null, async (set) => {
    let unsubLinkUpdate = () => {};

    const currentTab = await getCurrentTab();
    unsubLinkUpdate = listenLinkUpdate(currentTab.url, (link) => {
        if (link) {
            set(link);
        } else {
            set(linkFromTab(currentTab));
        }
    });

    const unsubscribeTabUpdate = registerOnTabUpdate(newTab => {
        unsubLinkUpdate();
        unsubLinkUpdate = listenLinkUpdate(newTab.url, (link) => {
            if (link) {
                set(link);
            } else {
                set(linkFromTab(newTab));
            }
        });
    });

    return () => {
        unsubLinkUpdate();
        unsubscribeTabUpdate();
    };
});

export const addTag = (tag, link) => {
    firestore.collection('tags')
        .doc(tag.id)
        .set({
            name: tag.name
        })
        .catch(err => console.error(err));
    firestore.collection('links')
        .doc(link.id)
        .set({
            title: link.title,
            url: link.url,
            faviconUrl: link.faviconUrl,
            tags: firebase.firestore.FieldValue.arrayUnion(tag.id),
            collections: link.collections,
        }, { merge: true })   // merge: true so we don't overwrite the tags array
        .catch(err => console.error(err));
};

export const toggleTag = (tagId, link) => {
    const tags = link.tags.includes(tagId)
        ? link.tags.filter(tId => tId !== tagId)
        : [...link.tags, tagId];

    if (tags.length === 0 && link.collections.length === 0) {
        /**
         * Caution: Not sure if delete fails if a document doesn't exist.
         * That is, if this link hasn't been saved to the DB, this call might fail.
         * But luckily it won't happen in our case because in our "toggleTag" operation,
         * a link that hasn't been saved to the DB would always end up having a non-zero tags.length
         */
        firestore.collection('links')
            .doc(link.id)
            .delete()
            .catch(err => console.error(err));
    } else {
        firestore.collection('links')
            .doc(link.id)
            .set({
                title: link.title,
                url: link.url,
                faviconUrl: link.faviconUrl,
                tags: tags,
                collections: link.collections
            })
            .catch(err => console.error(err));
    }
};

export const mappedTags = derived(
    [tags, currentLink],
    ([ $tags, $link ]) => {
        return $tags.map(tag => ({
            ...tag,
            added: $link?.tags.includes(tag.id)
        }));
    }
);

const fromFirestoreTimestamp = (timestamp) => {
    return timestamp.toDate().toISOString();
};

const toFirestoreTimestamp = (timeString) => {
    return firebase.firestore.Timestamp.fromDate(new Date(timeString));
};

export const mappedCollections = derived(
    collections,
    ($collections) => {
        return $collections.map(collection => ({
            ...collection,
            createdAt: fromFirestoreTimestamp(collection.createdAt),
            updatedAt: fromFirestoreTimestamp(collection.updatedAt),
        }));
    }
);

export const addCollection = (collection, links) => {
    const { id, name, createdAt, updatedAt } = collection;

    const colsRef = firestore.collection('collections');
    const linksRef = firestore.collection('links');

    const batch = firestore.batch();
    batch.set(colsRef.doc(id), {
        name,
        createdAt: toFirestoreTimestamp(createdAt),
        updatedAt: toFirestoreTimestamp(updatedAt),
    });

    links.forEach(link => {
        batch.set(linksRef.doc(link.id), {
                title: link.title,
                url: link.url,
                faviconUrl: link.faviconUrl,
                tags: link.tags,
                collections: firebase.firestore.FieldValue.arrayUnion(id), // merge: true so we don't overwrite the collections array
            }, { merge: true });
    });
    batch.commit()
        .catch(err => console.error(err));
};
