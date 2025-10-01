import React, { useCallback, useRef, useEffect } from 'react';
import Bem from 'react-better-bem';

import { useHiddenUIComponent } from '../../hooks';
import { useAppStateContext } from '../../context';

import { Button, Icon } from '../';

import notificationIcons from '../../assets/notificationIcons';

import styles from './Toast.module.scss';

const ICON_MAP = {
    'GENERAL': null,
    'INFO': 'info-circle',
    'SUCCESS': 'checkmark-circle',
    'WARNING': 'warning',
    'ERROR': 'exclamation-circle'
};

const Toast = ({ type, title, children, index, timeout, noDismiss }) => {

    const { notifications: { dismiss } } = useAppStateContext();

    const dismissNotification = useCallback(() => {
        dismiss(index);
    }, [dismiss, index]);

    const {
        visible,
        hidden,
        close,
        hide
    } = useHiddenUIComponent(undefined, dismissNotification, true);

    const timeoutRef = useRef();
    useEffect(() => {
        if (!noDismiss && timeout > -1) {
            timeoutRef.current = setTimeout(close, timeout);
        }
        return () => {
            clearTimeout(timeoutRef.current);
        }
    }, [timeout, close, noDismiss]);

    const iconSrc = notificationIcons[ICON_MAP[type]];

    return (
        <Bem style={styles}>
            <div
                el="toast"
                mod={[type.toLowerCase(), { visible, hidden }]}
                onAnimationEnd={hide}
            >
                <div el="content">
                    {iconSrc && (
                        <Icon
                            src={iconSrc}
                            size="extra-large"
                            color={`notification-${type.toLowerCase()}-border`}
                            className={styles.toast__content__icon}
                        />
                    )}
                    <div el="text">
                        {title && <h3>{title}</h3>}
                        {children}
                    </div>
                </div>
                {!noDismiss && (
                    <Button
                        className={styles.toast__button}
                        icon="cross"
                        variant="mini"
                        onClick={close}
                    />
                )}
            </div>
        </Bem>
    );
};

export default Toast;
