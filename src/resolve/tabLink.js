import { urlEqual, uniqueId } from '../utils';

export const mapTabsToLinks = (tabs, links) => {
    /**
     * Turns each tab to a link.
     * If the tab exists in the 'links' list through checking URL equality, use that link's ID
     * If the tab doesn't exist in the link, generate a new ID
     */

    return tabs.map(tab => {
        const matchingLink = links.find(link => urlEqual(link.url, tab.url));
        return {
            ...tab,
            id: matchingLink ? matchingLink.id : uniqueId()
        };
    });
};
