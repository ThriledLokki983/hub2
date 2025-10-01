import { useReducer, useCallback } from 'react';

const WARNING_TYPES = ['SUCCESS', 'WARNING', 'ERROR', 'INFO', 'GENERAL'];

const DEFAULT_TIMEOUTS = {
    'SUCCESS': 5000,
    'WARNING': -1,
    'ERROR': -1,
    'INFO': 5000,
    'GENERAL': 5000
};

export const useNotifications = () => {
    const [notifications, dispatchNotifications] = useReducer(notificationsReducer, []);

    const push = useCallback((type, content, { title, timeout, noDismiss = false }) => {
        if (WARNING_TYPES.includes(type)) {
            dispatchNotifications({
                type: 'PUSH',
                notificationType: type,
                noDismiss,
                title,
                timeout: timeout || DEFAULT_TIMEOUTS[type],
                content
            });
        }
    }, []);

    const getNotification = useCallback((searchIndex) => {
        return notifications.find(({ index }) => index === searchIndex);
    }, [notifications]);

    const pushSuccess = useCallback((content, { title, timeout, noDismiss }) => {
        push('SUCCESS', content, { title, timeout, noDismiss });
    }, [push]);

    const pushWarning = useCallback((content, { title, timeout, noDismiss }) => {
        push('WARNING', content, { title, timeout, noDismiss });
    }, [push]);

    const pushError = useCallback((content, { title, timeout, noDismiss }) => {
        push('ERROR', content, { title, timeout, noDismiss });
    }, [push]);

    const pushInfo = useCallback((content, { title, timeout, noDismiss }) => {
        push('INFO', content, { title, timeout, noDismiss });
    }, [push]);

    const pushGeneral = useCallback((content, { title, timeout, noDismiss }) => {
        push('GENERAL', content, { title, timeout, noDismiss });
    }, [push]);

    const dismiss = useCallback((index) => {
        dispatchNotifications({ type: 'DISMISS', index });
    }, []);

    return {
        success: pushSuccess,
        warning: pushWarning,
        error: pushError,
        info: pushInfo,
        general: pushGeneral,
        notifications,
        get: getNotification,
        dismiss
    };
};

export default useNotifications;


function notificationsReducer (state, action) {
    const { type } = action;

    switch (type) {
        case 'PUSH': {
            const { notificationType, content, title, timeout, noDismiss } = action;

            const index = state.length;

            return state.concat({
                type: notificationType,
                content,
                title,
                timeout,
                index,
                noDismiss,
                dismissed: false
            });
        }
        case 'DISMISS': {
            const { index: removeIndex } = action;

            return state.map(({ index, noDismiss, ...notification }) => ({
                ...notification,
                index,
                noDismiss,
                ...(!noDismiss && index === removeIndex && { dismissed: true })
            }));
        }
        default: {
            return state;
        }
    }
}
