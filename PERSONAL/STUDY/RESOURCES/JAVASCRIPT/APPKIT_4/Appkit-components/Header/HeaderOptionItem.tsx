import React from 'react';
import { KEY_VALUES } from '../../../configs/config';
import ClassNames from 'classnames';

export interface HeaderOptionProps {
    label?: string,
    style?: React.CSSProperties,
    className?: string,
    iconName?: string,
    onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void,
    iconSlot?: string;
    children?: React.ReactElement;
}

const HeaderOptionItem: React.FC<HeaderOptionProps> = (props) => {
    const {
        label = '',
        style,
        className = '',
        iconName = '',
        onClick,
        iconSlot = 'start',
        children,
    } = props;

    const classes = ClassNames('ap-header-options-item', className, {
        'reverse': iconSlot === 'end',
        'has-icon': iconName,
        'has-label': label
    });

    const keyupEvent = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== KEY_VALUES.ENTER) {
            return;
        }
        onClick?.(event);
    };
    return (
        (label || iconName) ?
            (
                <div className={classes} style={style} tabIndex={0} role="button" onClick={onClick} onKeyUp={keyupEvent}>
                    <div className="ap-header-options-icon-wrapper">
                        <span className={`Appkit4-icon icon-${iconName}`} aria-hidden={label ? true : false} aria-label={label ? '' : iconName}></span>
                    </div>
                    {label ? <span className="ap-header-options-label">{label}</span> : children}
                </div>
            ) : null
    )
}

export default HeaderOptionItem
