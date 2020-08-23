import { linkFromTab } from './utils';
import {
    getAllTags, getAllLinks, getTagsLinks, getAllCollections,
    setAllTags, setAllLinks, setTagsLinks
} from './services/storage';
import {
    getLinkOfUrl, getTagIds,
    settleTags, settleLinks, settleTagsLinks
} from './resolve';

export const initTagsState = async (currentTab) => {
    /**
     * Return all tags and whether each of them is associated with the currently active link
     * given the current window's active tab and the data in the persistent storage
     */

    const [ tags, links, tagsLinks ] = await Promise.all([
        getAllTags(),
        getAllLinks(),
        getTagsLinks()
    ]);
    const storageData = { tags, links, tagsLinks };

    const currentLink = getLinkOfUrl(storageData, currentTab.url);

    const tagIds = currentLink === undefined
        ? new Set()
        : getTagIds(storageData, currentLink);

    return {
        tags: Object.entries(tags).map(([ id, tagBody ]) => ({
            id,
            name: tagBody.name,
            added: tagIds.has(id)
        })),
        currentLink: linkFromTab(currentTab, currentLink)
    };
};

export const initOpenTabsState = async (openTabs) => {
    /**
     * Return the current open links and all collections
     * given the current window's open tabs and the data in the persistent storage
     */

    const [ links, collections ] = await Promise.all([
        getAllLinks(),
        getAllCollections()
    ]);

    const openLinks = openTabs.map(tab => {
        const link = getLinkOfUrl({ links }, tab.url);
        return linkFromTab(tab, link);
    });

    return {
        openLinks,
        collections: Object.entries(collections).map(([ id, body ]) => ({
            id,
            ...body
        }))
    };
};

export const tagsStateToStorage = async (tags, currentLink) => {
    // TODO: if any of the set storage calls fail, retry that which failed. If retry can't succeed, rollback those that succeeded

    if (currentLink === undefined || currentLink === null) return;

    const [ storageTags, storageLinks, storageTagsLinks ] = await Promise.all([
        getAllTags(),
        getAllLinks(),
        getTagsLinks()
    ]);

    const updatedTags = settleTags({ tags: storageTags }, { tags });
    const updatedLinks = settleLinks({ links: storageLinks }, { tags, currentLink });
    const updatedTagsLinks = settleTagsLinks({ tagsLinks: storageTagsLinks }, { tags, currentLink });

    await setAllTags(updatedTags)
    await setAllLinks(updatedLinks)
    await setTagsLinks(updatedTagsLinks)
};
