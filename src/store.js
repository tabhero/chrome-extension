import { writable, readable, derived } from 'svelte/store';

import firebase, { firestore } from './services/firebase';
import { getCurrentTab, registerOnTabUpdate } from './services/chrome';
import { normalUrl, linkFromTab } from './utils';

export const currentTabTags = writable([]);
export const currentTabLink = writable(null);

const getStoreFromCollection = (collectionName) => {
    return readable([], function start(set) {
        const unsubscribe = firestore.collection(collectionName).onSnapshot({
            next: (snapshot) => {
                const docs = snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id,
                    };
                });
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
            const link = {
                ...doc.data(),
                id: doc.id,
            };
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
            tags: firebase.firestore.FieldValue.arrayUnion(tag.id)
        }, { merge: true })   // merge: true so we don't overwrite the tags array
        .catch(err => console.error(err));
};

export const toggleTag = (tagId, link) => {
    const tags = link.tags.includes(tagId)
        ? link.tags.filter(tId => tId !== tagId)
        : [...link.tags, tagId];

    if (tags.length === 0) {  // TODO: tags.length === 0 && collections.length === 0
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
                tags: tags
            }, { merge: true })   // merge: true so we don't overwrite the tags array
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
