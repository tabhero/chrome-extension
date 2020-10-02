import { customAlphabet } from 'nanoid';
import normalizeUrl from 'normalize-url';

export const urlEqual = (url1, url2) => {
    return normalizeUrl(url1) === normalizeUrl(url2);
};

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-!?@#$%^&*(){}[]|<>.,;:+=', 18);
export const uniqueId = () => {
    return nanoid();
};

export const normalUrl = (url) => {
    if (url.startsWith('chrome-extension://')) {
        return url;
    }

    let normalisedUrl;
    try {
        normalisedUrl = normalizeUrl(url);
    } catch (error) {
        // in cases of view-source urls like view-source:https://developer.mozilla.org, etc
        normalisedUrl = url;
    }

    return normalisedUrl;
};

export const linkFromTab = (tab, link) => {
    /**
     * Update the link fields given the tab fields. Only the link's id will persist through the promotion.
     * All tab related fields will be overridden by the tab
     */
    const updatedLink = {
        id: link ? link.id : uniqueId(),
        url: normalUrl(tab.url),
        title: tab.title,
        faviconUrl: tab.faviconUrl,
        tags: link ? link.tags : []
    };
    return updatedLink;
};

export const createTab = (chromeTab) => {
    const { title, url, favIconUrl, pendingUrl } = chromeTab;
    return {
        title,
        url: url === '' ? pendingUrl : url,
        faviconUrl: favIconUrl || '',
    };
};

export const twelveHourTime = (date) => {
    // src: https://stackoverflow.com/a/8888498
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return formattedTime;
};
