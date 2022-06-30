import { findInstance } from 'react-dom-instance';

/**
 * This method tries to get the react component instance for the tablist in the
 * inspector, tries to find a (tab) child-node with the given key (i.e. the tab
 * id as per ui configuration) and overrides the (internal) state of that tabs
 * component to activate the tab (if found).
 * @param {string} id The tab id as configured in the node-type configuration
 */
export const focusInspectorTab = (id) => {
    const inspectorNode = document.getElementById('neos-Inspector');
    if (!inspectorNode) {
        console.warn('could not find inspector');
        return;
    }

    try {
        const tabsNode = inspectorNode.querySelector('[role=tablist]');
        if (!tabsNode) {
            console.warn('could not find tabs element');
            return;
        }

        const tabsInstance = findInstance(tabsNode);

        // the children are actually filtered, i.e. tabsInstance state may have
        // tabs configured that are not shown because they don't contain visible
        // properties or views
        const children = tabsInstance.props.children;
        const tabIndex = children.findIndex(c => c.key === id);
        if (tabIndex < 0) {
            console.warn('did not find a tab with the given id');
            return;
        }

        tabsInstance.updater.enqueueSetState(tabsInstance, {
            activeTab: tabIndex,
        });
    } catch (e) {
        console.error('error accessing inspector tabs', e);
    }
};
