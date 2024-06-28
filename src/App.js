/* global SillyTavern */
/* global jQuery */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Page from './Page';

/**
 * @typedef {object} Page
 * @property {string} title - The title of the page
 * @property {string} content - The content of the page
 */

/**
 * Import a member from a URL, bypassing webpack.
 * @param {string} url URL to import from
 * @param {string} what Name of the member to import
 * @param {any} defaultValue Fallback value
 * @returns {any} Imported member
 */
async function importFromUrl(url, what, defaultValue = null) {
    try {
        const module = await import(/* webpackIgnore: true */ url);
        if (!module[what]) {
            throw new Error(`No ${what} in module`);
        }
        return module[what];
    }
     catch (error) {
        console.error(`Failed to import ${what} from ${url}: ${error}`);
        return defaultValue;
     }
}

const dragElement = await importFromUrl('../../../../RossAscends-mods.js', 'dragElement', () => { });

/**
 * Persistent state manager for the notebook.
 */
class StateManager {
    /**
     * Get the list of pages in the notebook from extension settings.
     * @returns {Page[]} List of pages
     */
    static getPages() {
        const context = SillyTavern.getContext();
        return _.get(context, 'extensionSettings.notebook.pages', []);
    }

    /**
     * Set the list of pages in the notebook to extension settings.
     * @param {Page[]} pages List of pages to set
     */
    static setPages(pages) {
        const context = SillyTavern.getContext();
        _.set(context, 'extensionSettings.notebook.pages', pages);
        context.saveSettingsDebounced();
    }
}

function App({ onCloseClicked }) {
    const [pages, setPages] = useState(StateManager.getPages());
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        dragElement(jQuery(document.getElementById('notebookPanel')));
    }, []);

    function handleChange(index, page) {
        const newPages = [...pages];

        if (!page) {
            newPages.splice(index, 1);
            if (selectedIndex >= newPages.length) {
                setSelectedIndex(newPages.length - 1);
            }
        } else {
            newPages[index] = page;
        }

        setPages(newPages);
        StateManager.setPages(newPages);
    }

    function addPage() {
        const newPage = { title: 'Untitled', content: '' };
        const newPages = [...pages, newPage];
        setPages(newPages);
        StateManager.setPages(newPages);
    }

    function sliceTitle(title) {
        return title && title.length > 10 ? title.slice(0, 10) + '…' : title;
    }

    return (
        <>
            <div className="panelControlBar flex-container alignItemsBaseline">
                <div id="notebookPanelheader" className="fa-fw fa-solid fa-grip drag-grabber"></div>
                <div id="notebookPanelMaximize" className="inline-drawer-maximize">
                    <i className="floating_panel_maximize fa-fw fa-solid fa-window-maximize"></i>
                </div>
                <div id="notebookPanelClose" className="fa-fw fa-solid fa-circle-xmark floating_panel_close" onClick={() => onCloseClicked()}></div>
            </div>
            <div id="notebookPanelHolder" name="notebookPanelHolder" className="scrollY">
                <Tabs selectedIndex={selectedIndex} onSelect={(index) => setSelectedIndex(index)}>
                    <TabList>
                        {pages.map((page, index) => (
                            <Tab key={index}>{sliceTitle(page.title) || '[No name]'}</Tab>
                        ))}
                        <Tab onClick={() => addPage()} title="Add a note">
                            <i className="fa-solid fa-plus"></i>
                        </Tab>
                    </TabList>
                    {pages.map((page, index) => (
                        <TabPanel key={index}>
                            <Page page={page} onChange={(newPage) => handleChange(index, newPage)} />
                        </TabPanel>
                    ))}
                    <TabPanel>
                    </TabPanel>
                    {pages.length === 0 && (
                        <div className="flex-container flexFlowColumn alignItemsCenter">
                            <h3>Click the + button to add a note.</h3>
                        </div>
                    )}
                </Tabs>
            </div>
        </>
    );
}

export default App;
