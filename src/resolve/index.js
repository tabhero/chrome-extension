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

export const settleCollections = (storageCollections, appCollections, linksToSave, updatedCollectionId) => {
    return {
        collections: {
            ...storageCollections.collections,
            ...Object.fromEntries(appCollections.map(({ id, ...rest }) => [ id, { ...rest } ]))
        },
        links: {
            ...storageCollections.links,
            [updatedCollectionId]: Object.fromEntries(linksToSave.map(({ id, ...rest }) => [ id, { ...rest } ]))
        }
    };
};

export const settleOpenTabsLinks = (storageLinks, openTabsLinks) => {
    return {
        ...storageLinks,
        ...Object.fromEntries(openTabsLinks.map(({ id, ...rest}) => [ id, { ...rest } ]))
    };
};

export const mergeLinks = (linksListOne, linksListTwo) => {
    /**
     * The list items are of the Link type, which are assumed to already have normalised urls
     */
    linksListOne = linksListOne.slice();
    linksListTwo = linksListTwo.slice();

    const result = [];
    while (linksListTwo.length > 0) {
        const link = linksListTwo[0];
        const matchResult = linksListOne.findIndex(l => l.url === link.url);

        const processedLink = linksListTwo.shift();
        result.push(processedLink);

        if (matchResult !== -1) {
            linksListOne.splice(matchResult, 1);
        }
    }

    result.push(...linksListOne);

    return result;
};
