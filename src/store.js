import { writable, readable } from 'svelte/store';

import { firestore } from './services/firebase';
import { getCurrentTab, registerOnTabUpdate } from './services/chrome';
import { normalUrl, linkFromTab } from './utils';

export const currentTabTags = writable([]);
export const currentTabLink = writable(null);

export const tags = readable([], function start(set) {
    const unsubscribe = firestore.collection('tags').onSnapshot({
        next: (snapshot) => {
            const tags = snapshot.docs.map(documentSnapshot => documentSnapshot.data());
            set(tags);
        },
        error: (error) => {
            console.log(error);
        }
    });
    return function stop() {
        unsubscribe();
    };
});

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

export const addTag = (tag) => {
    const { id, name } = tag;
    return firestore.collection('tags').doc(id).set({ name })
        .catch(err => console.error(err));
};
