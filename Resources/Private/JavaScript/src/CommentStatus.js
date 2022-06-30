import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { neos } from '@neos-project/neos-ui-decorators';
import { actions, selectors } from '@neos-project/neos-ui-redux-store';
import { IconButton } from '@neos-project/react-ui-components';
import { $get, $transform } from 'plow-js';
import styles from './styles.css';
import { focusInspectorTab } from './util';

@neos(globalRegistry => ({
    nodeTypeRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    node: selectors.CR.Nodes.focusedSelector,
    sidebarHidden: selectors.UI.RightSideBar.isHidden,
}), {
    toggleSidebar: actions.UI.RightSideBar.toggle,
})
export default class CommentStatus extends PureComponent {
    static propTypes = {
        node: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        nodeTypeRegistry: PropTypes.object.isRequired,
        sidebarHidden: PropTypes.bool,
        toggleSidebar: PropTypes.function,
    };

    handleShowComments = () => {
        const { sidebarHidden, toggleSidebar } = this.props;

        const focusTab = () =>
            focusInspectorTab(this.getCommentsTab());

        if (sidebarHidden) {
            toggleSidebar();
            // opening the sidebar is a redux action, so this is all sorts of evil...
            setTimeout(focusTab, 200);
        } else {
            focusTab();
        }
    }

    /**
     * Tries to determine the inspector tab id the "comments" property is
     * defined for
     * @returns {null|string}
     */
    getCommentsTab = () => {
        const { node, nodeTypeRegistry } = this.props;

        if (!node) {
            return null;
        }

        const nodeType = nodeTypeRegistry.get(node.nodeType);
        if (!nodeType) {
            return null;
        }

        const inspectorConfig = $get(['properties', 'comments', 'ui', 'inspector'], nodeType);
        const { editor, group } = inspectorConfig || {};
        if (editor !== 'Neos.Neos.UI.NetworkteamContentComments:CommentEditor') {
            return null;
        }

        const uiGroup = $get(['ui', 'inspector', 'groups', group], nodeType);
        const { tab } = uiGroup || {};

        return tab || null;
    }

    render() {
        const { node, i18nRegistry } = this.props;
        // getting the (synchronized) inspector tab selection is probably not feasible
        const active = false;

        const comments = JSON.parse((node.properties.comments || '[]'));
        const commentCount = comments.filter(c => c.deleted !== true).length;

        const disabled = this.getCommentsTab() === null;

        return (
            <div className={styles.iconWrapper}>
                <IconButton
                    id="neos-InlineToolbar-NodeComments"
                    isActive={active}
                    disabled={disabled}
                    onClick={this.handleShowComments}
                    icon="comments"
                    hoverStyle="brand"
                    title={i18nRegistry.translate('Prgfx.Neos.ContentCommentAnnotation:Main:gotoComments')}
                />
                {commentCount > 0 && (
                    <span className={styles.commentCount}>{commentCount}</span>
                )}
            </div>
        );
    }
}
