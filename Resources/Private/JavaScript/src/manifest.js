import React from 'react';
import manifest from '@neos-project/neos-ui-extensibility';
import CommentStatus from './CommentStatus';

manifest('Prgfx.Neos.ContentCommentAnnotation', {}, (globalRegistry) => {
    const guestFrameRegistry = globalRegistry.get('@neos-project/neos-ui-guest-frame');
    guestFrameRegistry.set('NodeToolbar/Buttons/ContentComments', CommentStatus);
});
