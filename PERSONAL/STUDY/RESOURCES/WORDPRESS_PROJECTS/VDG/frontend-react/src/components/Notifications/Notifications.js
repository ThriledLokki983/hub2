import React, { useMemo } from 'react';
import Bem from 'react-better-bem';

import { useAppStateContext } from '../../context';
import { Toast } from '../';

import styles from './Notifications.module.scss';

const Notifications = () => {

    const { notifications: { notifications } } = useAppStateContext();

    const nonDismissedNotifications = useMemo(() =>
        notifications.filter(({ dismissed }) => !dismissed).reverse()
    , [notifications]);

    if (!nonDismissedNotifications.length) {
        return null;
    }

    return (
        <Bem style={styles}>
            <div
                el="notifications"
            >
                {nonDismissedNotifications
                    .map(({ type, content, title, index, timeout, noDismiss }) => (
                        <Toast
                            key={`toast-notification-${type}-${index}`}
                            type={type}
                            title={title}
                            index={index}
                            timeout={timeout}
                            noDismiss={noDismiss}
                        >
                            {content}
                        </Toast>
                    ))
                }
            </div>
        </Bem>
    );
};

export default Notifications;
