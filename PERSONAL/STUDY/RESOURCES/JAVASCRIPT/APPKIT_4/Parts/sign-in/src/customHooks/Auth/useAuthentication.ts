import { useState, useCallback, useReducer } from 'react';
import  NotLoggedInRedirect  from '../../components/loggedInRedirect/NotLoggedInRedirect';
const WARNING_TYPES = ['SUCCESS', 'WARNING', 'ERROR', 'INFO', 'GENERAL'];

const DEFAULT_TIMEOUTS: any = {
    'SUCCESS': 5000,
    'WARNING': -1,
    'ERROR': -1,
    'INFO': 5000,
    'GENERAL': 5000
};


const useAuthentication = () => {
     const [notifications, dispatchNotifications] = useReducer(notificationsReducer, []);
    const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(true);

     const push = useCallback((type: any, content: any, { title, timeout, noDismiss = false }: any) => {
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

      const pushError = useCallback((content: any, { title, timeout, noDismiss }: any) => {
        push('ERROR', content, { title, timeout, noDismiss });
    }, [push]);

     const revoke = useCallback((redirect: any) => {
        if (redirect) {
            pushError(NotLoggedInRedirect, { title: 'Niet ingelogd!', noDismiss: true });
        }
        setIsAuthenticated(false);
    }, []);

     const authenticate = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    function notificationsReducer (state: any, action: any) {
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

            return state.map(({ index, noDismiss, ...notification }: any) => ({
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

    return {
        notifications,
        push,
        pushError,
        revoke,
        isAuthenticated,
        authenticate
    };


}

export default useAuthentication