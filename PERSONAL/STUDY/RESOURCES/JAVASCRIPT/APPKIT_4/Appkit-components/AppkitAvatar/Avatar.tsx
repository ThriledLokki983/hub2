import React, { useEffect } from 'react';
import { KEY_VALUES } from '../../../configs/config';
import { mergeRefs } from '../../../util/helpers';
import classNames from 'classnames';

export interface AvatarProps
    extends React.HTMLAttributes<HTMLSpanElement> {
        // prefixCls?: string;
        className?: string;
        src?: string;
        icon?: React.ReactNode;
        srcSet?: string;
        size?: number;
        bgColor?: string;
        // shape?: 'circle' | 'square';
        style?: React.CSSProperties;
        label?: string;
        imageAlt?: string;
        mask?: boolean;
        tabIndex?: number;
        disabled?: boolean;
        ariaLabel?: string;
        onClick?: (event: React.SyntheticEvent) => void;
    }

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    (
        {
            // prefixCls,
            className,
            style,
            size = 40,
            bgColor,
            // shape = 'circle',
            label,
            icon,
            src,
            srcSet,
            imageAlt,
            mask,
            tabIndex = 0,
            role = '',
            disabled = true,
            onClick,
            children,
            ariaLabel,
            ...rest
        },
        ref,
    ) => {
        const [keyboardFocus, setKeyboardFocus] = React.useState(true);

        const avatarRef = React.useRef(null);

        useEffect(() => {
            const eventHandler = (event: KeyboardEvent) => {
                const keycode = event.which;
                if (keycode === 9 && avatarRef.current) {
                    (avatarRef.current as HTMLElement).classList.add('keyboard-focus');
                }
            };

            const eventClickHandler = (event: MouseEvent) => {
                if (avatarRef.current) {
                    (avatarRef.current as HTMLElement).classList.remove('keyboard-focus');
                }
            };

            window.addEventListener('keydown', eventHandler);
            window.addEventListener('click', eventClickHandler);

            return () => {
                window.removeEventListener('keydown', eventHandler);
                window.removeEventListener('click', eventClickHandler);
            };
        });

        const avatarClassName = classNames('ap-avatar', className,
      {
        'mask': mask,
        'disabled': disabled,
        'keyboard-focus': keyboardFocus
      }
    );

        let childrenToRender = children;
        if (src || srcSet) {
            childrenToRender = (<img src={src} alt={imageAlt || 'avatar'} />);
        } else if (icon) {
            childrenToRender = icon;
        } else {
            childrenToRender = (<span className="ap-avatar-text">{label}</span>);
        }

        let avatarStyle: React.CSSProperties = typeof size === 'number' ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
        } : {};

        avatarStyle = {
            backgroundColor: bgColor,
            ...avatarStyle,
        };

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            onClick?.(e);
        };

        const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
            setKeyboardFocus(false);
        };

        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === KEY_VALUES.TAB) {
                setKeyboardFocus(true);
            }
        };

        return (
            <div
                ref={mergeRefs(ref, avatarRef)}
                role={role}
                className={avatarClassName}
                style={{ ...style, ...avatarStyle }}
                aria-label={ariaLabel || label}
                tabIndex={disabled ? undefined : tabIndex}
                onClick={disabled ? undefined : handleClick}
                onKeyDown={disabled ? undefined : handleKeyDown}
                onMouseDown={disabled ? undefined : handleMouseDown}
                {...rest}
            >{childrenToRender}
            </div>
        );
    },
);

Avatar.displayName = 'Avatar';

export default Avatar;
