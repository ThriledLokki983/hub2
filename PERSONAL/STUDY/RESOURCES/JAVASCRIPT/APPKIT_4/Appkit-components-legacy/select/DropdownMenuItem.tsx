import React, { useCallback, useState } from 'react';
import ClassNames from "classnames";
import { Checkbox } from "../checkbox";
import { highlight } from "./highlight";
import { _uuid } from '../utils';

import { ItemDataType } from './Select';

export interface DropdownMenuItemProps {
    style?: React.CSSProperties;
    className?: string;
    active?: boolean;
    disabled?: boolean;
    value?: any;
    label?: any;
    data?: any;
    focus?: boolean;
    onSelect?: (value: any, data: any, event: React.MouseEvent<HTMLDivElement>) => void;
    children?: React.ReactNode;
    dropdownItemArialabel?: boolean;
    badgeTemplate?: (item: ItemDataType) => React.ReactNode;
    prefixTemplate?: (item: ItemDataType) => React.ReactNode;
    suffixTemplate?: (item: ItemDataType) => React.ReactNode;
    multiple?: boolean;
    highlightWords?: string;
    role?: string;
    showIncreaseArrow?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>((props, ref) => {

    const {
        className,
        active,
        children,
        disabled,
        focus,
        value,
        label,
        data,
        onSelect,
        badgeTemplate,
        prefixTemplate,
        suffixTemplate,
        dropdownItemArialabel,
        multiple,
        highlightWords = '',
        role,
        showIncreaseArrow = false,
        ...rest
    } = props;

    const [hover, setHover] = useState(false);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (!disabled) {
                onSelect?.(value, data, event);
            }
        },
        [onSelect, disabled, value]
    );

    const onMouseEnter = () => {
        setHover(true);
    }

    const classNames = ClassNames('ap-option-item', {
        'disabled': disabled,
        'moved': focus,
        'active': active,
        'iconLink': hover
    });

    const itemId = `item-${_uuid(8, 16)}`;

    let badgeElement: any = null;
    let suffixElement = null;

    if (typeof badgeTemplate === 'function') {
        badgeElement = badgeTemplate(data);
    }

    if (typeof suffixTemplate === 'function') {
        suffixElement = suffixTemplate(data);
    }

    const renderLeft = () => {
        let prefixEle;
        if (typeof prefixTemplate === 'function') {
            prefixEle = prefixTemplate(data);
        }

        return (
            <>
                {
                    (multiple || prefixEle) && (
                        <div className="ap-checkbox-label">
                            {
                                multiple && <Checkbox tabIndex={-1} disabled={disabled} checked={active}></Checkbox>
                            }
                            {prefixEle && (
                                <div className="ap-option-prefix">
                                    {prefixEle}
                                </div>
                            )}
                        </div>
                    )
                }
                <label
                    className="ap-option-label"
                    htmlFor={itemId}
                    dangerouslySetInnerHTML={{ __html: highlight(highlightWords, label, false) }}
                >
                </label>
                <div aria-hidden>{badgeElement}</div>
            </>
        );
    };

    return (
        <div
            id={itemId}
            role={multiple ? 'checkbox' : role}
            className={classNames}
            aria-checked={active}
            aria-selected={active}
            aria-disabled={disabled}
            data-key={value}
            tabIndex={-1}
            onClick={handleClick}
            aria-label={dropdownItemArialabel ? (`${data.label}, ${data.descValue}`) : label}
            onMouseEnter={showIncreaseArrow ? () => !disabled && setHover(true) : undefined}
            onMouseLeave={showIncreaseArrow ? () => !disabled && setHover(false) : undefined}
            {...rest}
        >
            {
                children ? children : (
                    <>
                        <div className="ap-option-left">{renderLeft()}</div>
                        {showIncreaseArrow && <span className='Appkit4-icon icon-arrow-increase-small-outline'></span>}
                        {
                            suffixElement && <div className="ap-option-desc" aria-hidden>{suffixElement}</div>
                        }
                    </>
                )
            }
        </div>
    );
}
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export default DropdownMenuItem;
