import React, { useMemo } from 'react';
import Bem from 'react-better-bem';

import { useAppState } from '../../hooks';
import Toast from '../Toast/Toast';

import styles from './Notifications.module.scss';

const Notifications = () => {

    let { notifications: { notifications } } = useAppState();

    let nonDismissedNotifications = useMemo(() =>
        notifications.filter(({ dismissed }) => !dismissed).reverse()
    , [notifications]);

    if (!nonDismissedNotifications.length) {
        return null
    }

    console.log({nonDismissedNotifications});

    const a = [
        {
            type: 'GENERAL',
            content: 'This is a general notification',
            title: 'General',
            index: 0,
            timeout: 5000,
            noDismiss: false
        },
        {
            type: 'INFO',
            content: 'This is an info notification',
            title: 'Info',
            index: 1,
            timeout: 5000,
            noDismiss: false
        },
        {
            type: 'SUCCESS',
            content: 'This is a success notification',
            title: 'Success',
            index: 2,
            timeout: 5000,
            noDismiss: false
        }
    ]


    return (
        <Bem style={styles}>
            <div
                el="notifications"
            >
                {a
                .map(_c => {
                        console.log('type', _c);
                    return (
                        <Toast
                            key={`toast-notifications-${_type}-${index}`}
                            type={_type}
                            title={title}
                            index={index}
                            timeout={timeout}
                            noDismiss={noDismiss}
                        >
                            {content}
                        </Toast>
                    )})
                }
            </div>
        </Bem>
    );
};

export default Notifications;
