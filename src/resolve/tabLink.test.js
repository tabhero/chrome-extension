import test from 'ava';
import { intersection, zip } from 'lodash-es';
import { mapTabsToLinks } from './tabLink';

const assertFieldsAndIds = (t, tabs, links) => {
    zip(tabs, links).forEach(([ tab, link ]) => {
        const { id: linkId, ...linkBody } = link;
        t.deepEqual(linkBody, tab);
        t.truthy(linkId);
    });
};

test('mapTabsToLinks should map tabs to links with new IDs when no tabs match with any link', t => {
    const tabs = [{
        url: "url-a",
        title: "tab-title-1",
        faviconUrl: "tab-favicon-1"
    }, {
        url: "url-b",
        title: "tab-title-2",
        faviconUrl: "tab-favicon-2"
    }, {
        url: "url-c",
        title: "tab-title-3",
        faviconUrl: "tab-favicon-3"
    }];
    const links = [{
        id: "link-1",
        url: "url-x",
        title: "link-title-1",
        faviconUrl: "link-favicon-1"
    }, {
        id: "link-2",
        url: "url-y",
        title: "link-title-2",
        faviconUrl: "link-favicon-2"
    }];

    const outputLinks = mapTabsToLinks(tabs, links);

    const allLinkIds = links.map(link => link.id);
    const outputLinkIds = outputLinks.map(link => link.id);
    t.is(intersection(allLinkIds, outputLinkIds).length, 0);
    assertFieldsAndIds(t, tabs, outputLinks);
});

test('mapTabsToLinks should map tabs to links with IDs same as the IDs of the links they matched', t => {
    const tabs = [{
        url: "url-a",
        title: "tab-title-1",
        faviconUrl: "tab-favicon-1"
    }, {
        url: "url-b",
        title: "tab-title-2",
        faviconUrl: "tab-favicon-2"
    }, {
        url: "url-c",
        title: "tab-title-3",
        faviconUrl: "tab-favicon-3"
    }];
    const links = [{
        id: "link-1",
        url: "url-a",
        title: "link-title-1",
        faviconUrl: "link-favicon-1"
    }, {
        id: "link-2",
        url: "url-c",
        title: "link-title-2",
        faviconUrl: "link-favicon-2"
    }];

    const outputLinks = mapTabsToLinks(tabs, links);

    const allLinkIds = links.map(link => link.id);
    const outputLinkIds = outputLinks.map(link => link.id);
    t.is(intersection(allLinkIds, outputLinkIds).length, 2);
    assertFieldsAndIds(t, tabs, outputLinks);
    t.is(outputLinks[0].id, links[0].id);
    t.is(outputLinks[2].id, links[1].id);
});

test('mapTabsToLinks should map a tab to the first link with the same URL when multiple links have the same URL', t => {
    const tabs = [{
        url: "url-a",
        title: "tab-title-1",
        faviconUrl: "tab-favicon-1"
    }, {
        url: "url-b",
        title: "tab-title-2",
        faviconUrl: "tab-favicon-2"
    }, {
        url: "url-c",
        title: "tab-title-3",
        faviconUrl: "tab-favicon-3"
    }];
    const links = [{
        id: "link-1",
        url: "url-a",
        title: "link-title-1",
        faviconUrl: "link-favicon-1"
    }, {
        id: "link-2",
        url: "url-x",
        title: "link-title-2",
        faviconUrl: "link-favicon-2"
    }, {
        id: "link-3",
        url: "url-a",
        title: "link-title-3",
        faviconUrl: "link-favicon-3"
    }];

    const outputLinks = mapTabsToLinks(tabs, links);

    const allLinkIds = links.map(link => link.id);
    const outputLinkIds = outputLinks.map(link => link.id);
    t.is(intersection(allLinkIds, outputLinkIds).length, 1);
    assertFieldsAndIds(t, tabs, outputLinks);
    t.is(outputLinks[0].id, links[0].id);
});
