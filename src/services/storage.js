import { getChromeStorage, setChromeStorage } from './chrome';

export const getAllTags = () => {
    return getChromeStorage('tags', {});
};

export const getAllLinks = () => {
    return getChromeStorage('links', {});
};

export const getTagsLinks = async () => {
    const tagsLinks = await getChromeStorage('tags-links', []);
    return tagsLinks.map(([ tagId, linkId ]) => {
        return {
            tagId,
            linkId,
        };
    });
};

export const getAllCollections = () => {
    return getChromeStorage('collections', {});
};

export const setAllTags = (tags) => {
    return setChromeStorage('tags', tags);
};

export const setAllLinks = (links) => {
    return setChromeStorage('links', links);
};

export const setTagsLinks = (tagsLinks) => {
    return setChromeStorage('tags-links', tagsLinks.map(({ tagId, linkId }) => [tagId, linkId]));
};
