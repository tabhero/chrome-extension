import { debounce } from 'lodash-es';
import { createTab } from '../utils';

export const getCurrentTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const { title, url, pendingUrl, favIconUrl } = tabs[0];

            if (url === '' && pendingUrl === undefined) {
                return reject(new Error('Impossible state'));
            }

            resolve(createTab({
                title,
                url,
                pendingUrl,
                favIconUrl
            }));
        });
    });
};

export const getCurrentWindowTabs = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            resolve(tabs.map(createTab));
        });
    });
};

export const getChromeStorage = (key, defaultVal = []) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            let value = result[key];
            value = value === null || value === undefined
                ? defaultVal
                : value;
            resolve(value);
        });
    });
};

export const setChromeStorage = (key, value) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
};

export const registerOnTabUpdate = (handler) => {
    const listener = debounce((tabId, changeInfo, tab) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (tabId === currentTab.id) {
                // WARNING: tab.* and changeInfo.* properties have very inconsistent values even when triggered repeatedly through the same events.
                // tab.* seem to be more consistent. changeinfo title, url, favicon always seem to be undefined.
                handler(createTab(tab));
            }
        })
    }, 1500);

    /**
     * WARNING: onUpdated seems to emit 4 to 5 events when a tab changes, each in which changeInfo.status is supposed to be either "unloaded", "loading", or "complete"
     * BUT in reality changeInfo.status is undefined in most of those events.
     *
     * Also observed that the last of those events has the correct tab.title, tab.url, tab.favicon. The preceding events have the outdated values of those fields.
     * However, this last event always has a changeInfo.status === undefined. So can't filter out this event reliably.
     * Hence, workaround: debounce that handler to capture just that last event. Debounce with a wait that's more than the typical time diff between two events. Hence wait~1500ms
     */
    chrome.tabs.onUpdated.addListener(listener);

    return () => {
        chrome.tabs.onUpdated.removeListener(listener);
    };
};
