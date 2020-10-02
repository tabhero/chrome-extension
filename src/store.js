import { writable, readable } from 'svelte/store';

import { firestore } from './services/firebase';

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

export const addTag = (tag) => {
    const { id, name } = tag;
    return firestore.collection('tags').doc(id).set({ name })
        .catch(err => console.error(err));
};
