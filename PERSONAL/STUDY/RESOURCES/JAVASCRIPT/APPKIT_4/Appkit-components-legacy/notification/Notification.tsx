import * as React from "react";
import { useCallback } from 'react';
import classNames from "classnames";
import { useTimeout } from "./useTimeout";

import { KEY_VALUES } from '../utils';

const statuses: any = {
    'success': 'icon-success-fill',
    'warning': 'icon-warning-fill',
    'error': 'icon-error-fill'
};

export interface NotificationProps {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string | React.ReactNode;
    message?: string | React.ReactNode;
    hyperLink?: React.ReactNode;
    duration?: number;
    status?: 'error' | 'warning' | 'success' | string;
    icon?: React.ReactNode;
    closeIcon?: React.ReactNode;
    closeable?: boolean;
    close?: () => void;
    onClick?: (data: NotificationProps) => void;
    onClose?: (event?: React.SyntheticEvent) => void;
    position?: any;
    showTimer?: boolean;
    expandable?: boolean;
    children?: React.ReactNode;
    clickToClose?: boolean;
    config?: boolean;
    showNotice?: boolean;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
    (props, ref) => {
        const {
            id,
            title,
            message,
            closeable = true,
            hyperLink,
            status = 'default',
            className,
            icon: customIcon,
            closeIcon: customCloseIcon,
            onClose,
            close,
            clickToClose = false,
            showTimer,
            position = "static",
            duration = 0,
            children,
            onClick,
            expandable = false,
            config = false,
            showNotice = false,
            ...restProps
        } = props;

        const circleRef: any = React.useRef();
        let circlePos: number;
        let curtime: NodeJS.Timer;

        duration > 0 && useTimeout(() => {
            close?.();
            onClose?.();
        }, duration);

        const isTopHeader = position === 'topHeader' || position === 'static-topHeader';
        const [expand, setExpand] = React.useState(false);

        React.useEffect(() => {
            const dismiss: number = duration;
            const l = Math.ceil(6 * 2 * 3.14);
            const timelen = Math.floor(dismiss / l / 10);
            circlePos = l * 2;
            let circleLength = circlePos, start = new Date().getTime();
            // Used for appkit4 site static display, don't pass 'static-topHeader' for producton usage
            if (position === 'static-topHeader') {
                circlePos = 62;
                if (!circleRef.current) {
                    return;
                }
                circleRef.current.style.strokeDashoffset = circlePos;
            } else if ((position === 'topHeader') && showTimer) {
                curtime = setInterval(() => {
                    let current = new Date().getTime();
                    circlePos = circleLength - Math.ceil((current - start) / timelen) * 0.1;
                    if (circlePos <= l) {
                        circlePos = l;
                        clearInterval(curtime);

                        return;
                    }
                    if (!circleRef.current) {
                        return;
                    }
                    circleRef.current.style.strokeDashoffset = circlePos;
                }, timelen);
            }
        }, [])

        const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
            if (clickToClose) {
                close?.();
            }
            onClick?.(props);
        }
        const onKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLButtonElement>) => {
                if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
                    event.preventDefault();
                    if (config) {
                        close?.();
                    }
                    onClose?.(event);
                }

            },
            [close, onClose, config]
        );

        const handleClose = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) => {
                // console.log('event=2==',)
                if (config) {
                    close?.();
                }
                onClose?.(event);
            },
            [close, onClose, config]
        );

        const onExpand = (event: { preventDefault: () => void; stopPropagation: () => void; }) => {
            event.preventDefault();
            event.stopPropagation();
            setExpand(!expand);
        }

        const cx = statuses[status] || status;

        const classes = classNames('ap-notification', {
            [status]: isTopHeader,
            'ap-notice': showNotice,
            'has-icon': customIcon || cx,
        }, className);

        const classeexpandable = classNames('Appkit4-icon icon-down-chevron-outline', {
            'roate': expand
        });

        const dropdownClasses = classNames('ap-notification-content-dialog', {
            'open': isTopHeader && expand
        });
        const node = (
            <>
                {/* <div role="status" tabIndex={0} className="search-result" aria-live="polite">{status} notification:{message} </div> */}
                <div
                    id={id}
                    className={classes}
                    tabIndex={0}
                    aria-label={`${status} notification: ${typeof message == 'object' ? '' : message}`}
                    ref={ref}
                    onClick={handleClick}
                    {...restProps}
                >
                    <div className="ap-notification-content">
                        {(cx || customIcon) &&
                            (customIcon ? (
                                customIcon
                            ) : (
                                <span className={classNames("ap-notification-icon Appkit4-icon height", cx)} aria-hidden="true" />
                            ))
                        }
                        <div>
                            {
                                title && (
                                    <div className="ap-notification-message height ap-font-medium">
                                        {title}
                                    </div>
                                )
                            }
                            {
                                message && (
                                    <div tabIndex={typeof message == 'object' ? 0 : -1} className="ap-notification-description">
                                        {message}
                                    </div>
                                )
                            }
                            {hyperLink}
                        </div>
                        {
                            isTopHeader && expandable && (
                                <div className="ap-notification-toggle toggle-icon" onClick={onExpand}>
                                    <span className={classeexpandable}></span>
                                </div>
                            )
                        }
                    </div>
                    {isTopHeader && showTimer ?
                        <div role="button" aria-label="Timer" className="a-countdown-wrapper">
                            <svg height="24" width="24">
                                <circle className="a-circle a-countdown animated" ref={circleRef} cx="12" cy="12" r="6" ></circle>
                            </svg>
                        </div> : closeable && (
                            <button
                                className="ap-notification-icon-close"
                                aria-label="close"
                                onClick={handleClose}
                                onKeyDown={onKeyDown}
                            >
                                {customCloseIcon ? (
                                    customCloseIcon
                                ) : (
                                    <span className="Appkit4-icon icon-close-outline height ap-font-medium" />
                                )}
                            </button>
                        )
                    }
                </div>
                {
                    expandable && (
                        <div aria-hidden={expand ? false : true} tabIndex={expand ? 0 : -1} className={dropdownClasses}>
                            <div className="ap-padding-box">
                                {children}
                            </div>
                        </div>
                    )
                }
            </>
        );

        if (config) {
            return node;
        } else {
            return (
                <div className={`ap-notifications ap-notifications-${position}`}>
                    {node}
                </div>
            )
        }
    })

export default Notification;
