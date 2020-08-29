import { omit } from 'lodash-es';
import { urlEqual } from '../utils';

export const getLinkOfUrl = (storageData, url) => {
    const { links } = storageData;
    const res = Object.entries(links)
        .find(([ id, linkBody ]) => urlEqual(linkBody.url, url));

    if (res === undefined) return undefined;

    const [ id, body ] = res;

    return {
        id,
        ...body
    }
};

export const getTagIds = (storageData, link) => {
    const { tagsLinks } = storageData;
    const targetTagIds = tagsLinks
        .filter(({ linkId }) => linkId === link.id)
        .map(({ tagId }) => tagId);
    return new Set(targetTagIds);
};

export const settleTags = (storageData, appState) => {
    const { tags: storageTags } = storageData;
    const { tags } = appState;

    return {
        ...storageTags,
        ...Object.fromEntries(tags.map(({ id, name }) => [ id, { name } ]))
    };
};

export const settleLinks = (storageData, appState) => {
    const { links: storageLinks } = storageData;
    const { tags, currentLink } = appState;

    return tags.some(tag => tag.added)
        ? { ...storageLinks, [currentLink.id]: omit(currentLink, ['id']) }
        : omit(storageLinks, currentLink.id);
};

export const settleTagsLinks = (storageData, appState) => {
    const { tagsLinks: storageTagsLinks } = storageData;
    const { tags, currentLink } = appState;

    const candidateAddedTagIds = new Set(tags.filter(tag => tag.added).map(tag => tag.id));
    let updatedTagsLinks = [];

    for (const { tagId, linkId } of storageTagsLinks) {
        if (linkId === currentLink.id) {
            if (candidateAddedTagIds.has(tagId)) {
                // they used to be and are still associated. Keep this rel record
                // remove the candidate for the "append step"
                updatedTagsLinks.push({ tagId, linkId });
                candidateAddedTagIds.delete(tagId);
            }
        } else {
            updatedTagsLinks.push({ tagId, linkId });
        }
    }
    updatedTagsLinks = [
        ...updatedTagsLinks,
        ...[...candidateAddedTagIds].map(tagId => ({ tagId, linkId: currentLink.id }))
    ];

    return updatedTagsLinks;
};
